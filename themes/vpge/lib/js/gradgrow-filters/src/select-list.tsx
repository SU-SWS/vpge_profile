import styled from "styled-components";
import {useSelect, SelectOptionDefinition, SelectProvider, SelectValue} from '@mui/base/useSelect';
import {useOption} from '@mui/base/useOption';
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {useEffect, useState, useId, useRef, useLayoutEffect, RefObject, ReactNode} from "preact/compat";

interface OptionProps {
  rootRef: RefObject<HTMLUListElement>
  children?: ReactNode;
  value: string;
  disabled?: boolean;
}


const renderSelectedValue = (value: SelectValue<string, boolean>, options: SelectOptionDefinition<string>[]) => {

  if (Array.isArray(value)) {
    return value.map(item =>
      <span
        key={item}
      >
        {renderSelectedValue(item, options)}
      </span>
    );
  }
  const selectedOption = options.find((option) => option.value === value);
  return selectedOption ? selectedOption.label : null;
}

const StyledOption = styled.li<{ selected: boolean, highlighted: boolean }>`
  cursor: pointer;
  overflow: hidden;
  background: ${props => props.selected ? "#5d4b3c" : props.highlighted ? "#eaeaea" : ""};
  color: ${props => props.selected ? "#fff" : props.highlighted ? "#2e2d29" : ""};

  &:hover {
    background: ${props => props.selected || props.highlighted ? "" : "#eaeaea"};
    text: #2E2D29
  }
`

function CustomOption(props: OptionProps) {

  const {children, value, rootRef, disabled = false} = props;
  const {getRootProps, highlighted, selected} = useOption({rootRef: rootRef, value, disabled, label: children});

  const {id, ...otherProps}: { id: string } = getRootProps();

  useEffect(() => {
    if (highlighted && id && rootRef?.current?.parentElement) {
      const item = document.getElementById(id);
      if (item) {
        const itemTop = item?.offsetTop;
        const itemHeight = item?.offsetHeight;
        const parentScrollTop = rootRef.current.parentElement.scrollTop
        const parentHeight = rootRef.current.parentElement.offsetHeight;

        if (itemTop < parentScrollTop) {
          rootRef.current.parentElement.scrollTop = itemTop;
        }

        if ((itemTop + itemHeight) > parentScrollTop + parentHeight) {
          rootRef.current.parentElement.scrollTop = itemTop - parentHeight + itemHeight;
        }
      }
    }
  }, [rootRef, id, highlighted])

  return (
    <StyledOption
      {...otherProps}
      id={id}
      selected={selected}
      highlighted={highlighted}
    >
      {children}
    </StyledOption>
  );
}

interface Props {
  options: SelectOptionDefinition<string>[];
  label?: string
  ariaLabelledby?: string
  defaultValue?: SelectValue<string, boolean>
  onChange?: (event: MouseEvent | KeyboardEvent | FocusEvent | null, value: SelectValue<string, boolean>) => void;
  multiple?: boolean
  disabled?: boolean
  value?: SelectValue<string, boolean>
  required?: boolean
  emptyValue?: string
  emptyLabel?: string
  name?: string
}

const SelectList = ({options = [], label, multiple, ariaLabelledby, required, defaultValue, name, emptyValue, emptyLabel = "- None -", ...props}: Props) => {
  const labelId = useId();
  const labeledBy = ariaLabelledby ?? labelId;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const [listboxVisible, setListboxVisible] = useState<boolean>(false);


  const {getButtonProps, getListboxProps, contextValue, value} = useSelect<string, boolean>({
    listboxRef,
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    defaultValue,
    multiple,
    ...props
  });

  useEffect(() => {
    listboxVisible && listboxRef.current?.focus();
  }, [listboxVisible]);

  useLayoutEffect(() => {
    const parentContainer = listboxRef.current?.parentElement?.getBoundingClientRect();
    if (parentContainer && (parentContainer.bottom > window.innerHeight || parentContainer.top < 0)) {
      listboxRef.current?.parentElement?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }, [listboxVisible, value])

  const optionChosen = (multiple && value) ? value.length > 0 : !!value;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <button
        {...getButtonProps()}
        aria-labelledby={labeledBy}
        style={{
          background: props.disabled ? "#D5D5D4": "#fff",
          color: "#000",
          width: "100%",
          border: "1px solid black",
          borderRadius: "5px",
          textAlign: "left",
          marginTop: "15px"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}>
          {label &&
            <div style={{
              position: "relative",
              top: optionChosen ? "-15px" : "",
              width: optionChosen ? "100%" : "",
            }}>
              <div
                id={labelId}
                style={{
                  width: "fit-content",
                  background: props.disabled ? "#D5D5D4": "#fff",
                  transition: "background-color .25s ease-in-out",
                  padding: "0 7px",
                }}
              >
                {label}
              </div>
            </div>
          }
          {optionChosen &&
            <div style={{overflow: "hidden", maxWidth: "calc(100% - 30px)"}}>
              {renderSelectedValue(value, options)}
            </div>
          }

          <ChevronDownIcon width={20} style={{flexShrink: "0"}}/>
        </div>
      </button>

      <div
        style={{
          position: "absolute",
          zIndex: "10",
          background: "#fff",
          maxHeight: "300px",
          overflowY: "scroll",
          width: "100%",
          border: "1px solid #D5D5D4",
          boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
          display: listboxVisible ? "block" : "none"
        }}
      >
        <ul
          {...getListboxProps()}
          aria-hidden={!listboxVisible}
          aria-labelledby={labeledBy}
          style={{
            listStyle: "none",
          }}
        >
          <SelectProvider value={contextValue}>
            {(!required && !multiple) &&
              <CustomOption value={emptyValue ?? ""} rootRef={listboxRef}>
                {emptyLabel}
              </CustomOption>
            }

            {options.map((option) => {
              return (
                <CustomOption key={option.value} value={option.value} rootRef={listboxRef}>
                  {option.label}
                </CustomOption>
              );
            })}
          </SelectProvider>
        </ul>
      </div>
      {name &&
        <input ref={inputRef} name={name} type="hidden" value={value ?? ""}/>
      }
    </div>
  );
}


export default SelectList;
