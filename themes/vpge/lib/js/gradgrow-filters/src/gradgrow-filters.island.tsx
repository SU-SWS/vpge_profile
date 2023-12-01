import {createIslandWebComponent} from 'preact-island'
import {useEffect, useRef, useState} from "preact/compat";
import SelectList from "./select-list";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  > * {
    flex: 1 1 0;
  }
`

const GradGrowFilters = () => {
  const ref = useRef(false);
  const typeSelect = document.querySelector('[id^="edit-content-type"]');
  const timeSelect = document.querySelector('[id^="edit-commitment"]');
  const competencySelect = document.querySelector('[id^="edit-competency"]');

  let defaultComp = competencySelect.options[competencySelect.selectedIndex]?.value
  let defaultSubComp = competencySelect.options[competencySelect.selectedIndex]?.value;

  // If the default value of the field is a subcompetency, it starts with a
  // dash. Traverse up the options until it finds one that isn't a subcompetency.
  if (competencySelect.options[competencySelect.selectedIndex]?.text.startsWith('-')) {
    for (let i = competencySelect.selectedIndex - 1; i >= 0; i--) {
      if (!competencySelect.options[i]?.text.startsWith('-')) {
        defaultComp = competencySelect.options[i].value;
        break;
      }
    }
  }

  const [competencyOptions, setCompetencyOptions] = useState([])
  const [opportunityOptions, setOpportunityOptions] = useState([])
  const [timeOptions, setTimeOptions] = useState([])

  const [selectedCompetency, setSelectedCompetency] = useState(defaultComp)
  const [selectedSubCompetency, setSelectedSubCompetency] = useState(defaultSubComp)
  const [selectedOpportunity, setSelectedOpportunity] = useState(typeSelect.options[typeSelect.selectedIndex]?.value)
  const [selectedTime, setSelectedTime] = useState(timeSelect.options[timeSelect.selectedIndex]?.value)

  const getSelectOptions = (elementId) => {
    const selectOptions = [];

    const options = document.getElementById(elementId).children;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const value = option.getAttribute('value')
      const label = option.textContent;
      if (value === 'All' || label.startsWith('--')) continue;

      if (label.startsWith('-')) {
        selectOptions[selectOptions.length - 1].below.push({
          value,
          label: label.substring(1)
        })
        continue;
      }
      selectOptions.push({value, label, below: []});
    }
    return selectOptions;
  }

  useEffect(() => {
    if (!ref.current && competencyOptions.length > 0) {
      ref.current = true;

      // Add some css directly to the head so it applies even after ajax.
      const css = '#views-exposed-form-vpge-grad-grow-filters-block { display: none; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
      head.appendChild(style);
      style.appendChild(document.createTextNode(css));
    }
  }, [competencyOptions, ref]);

  useEffect(() => {
    const onPopState = (e) => {
      // Easiest way to handle the back button, just reload the page.
      window.location.reload();
    }

    setCompetencyOptions(getSelectOptions('edit-competency'))
    setOpportunityOptions(getSelectOptions('edit-content-type'))
    setTimeOptions(getSelectOptions('edit-commitment'))

    window.addEventListener('popstate', onPopState);
    return (() => window.removeEventListener('popstate', onPopState));
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (selectedSubCompetency) {
      competencySelect.value = selectedSubCompetency
    } else {
      competencySelect.value = selectedCompetency || 'All'
    }
    typeSelect.value = selectedOpportunity || 'All'
    timeSelect.value = selectedTime || 'All'

    const paramObject = {};
    if (competencySelect.value && competencySelect.value !== 'All') paramObject[competencySelect.getAttribute('name')] = competencySelect.value
    if (typeSelect.value && typeSelect.value !== 'All') paramObject[typeSelect.getAttribute('name')] = typeSelect.value
    if (timeSelect.value && timeSelect.value !== 'All') paramObject[timeSelect.getAttribute('name')] = timeSelect.value

    const params = new URLSearchParams(paramObject);

    window.history.pushState(paramObject, '', `${window.location.pathname}?${params.toString()}`);
    document.querySelector('[id^="edit-submit-vpge-grad-grow"]')?.click()
  }

  const subCompetencies = competencyOptions.find(item => item.value === selectedCompetency)?.below || [];

  if (competencyOptions.length == 0) return null;

  return (
    <form style={{
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      borderBottom: "1px solid black",
      paddingBottom: "13.3rem",
      marginBottom: "2.7rem"
    }}>
      <fieldset style={{padding: 0}}>
        <legend style={{fontSize: "24px", marginBottom: "15px"}}>Filter by
          Competency
        </legend>

        <FilterContainer>
          <div>
            <SelectList
              options={competencyOptions}
              label="Competency"
              emptyLabel="- Any -"
              onChange={(e, value) => setSelectedCompetency(value)}
              defaultValue={selectedCompetency}
            />
          </div>
          <div>
            <SelectList
              options={subCompetencies}
              disabled={subCompetencies.length === 0}
              label="Sub-Competency"
              emptyLabel="- Any -"
              onChange={(e, value) => setSelectedSubCompetency(value)}
              defaultValue={selectedSubCompetency}
            />
          </div>
        </FilterContainer>
      </fieldset>

      <FilterContainer>
        <div>
          <SelectList
            options={opportunityOptions}
            label="Filter by Learning Opportunity"
            emptyLabel="- Any -"
            onChange={(e, value) => setSelectedOpportunity(value)}
            defaultValue={selectedOpportunity}
          />
        </div>

        <div>
          <SelectList
            options={timeOptions}
            label="Filter by Time Commitment"
            emptyLabel="- Any -"
            onChange={(e, value) => setSelectedTime(value)}
            defaultValue={selectedTime}
          />
        </div>
      </FilterContainer>
      <button onClick={submit} style={{width: "fit-content"}}>Apply Filters
      </button>

      {(selectedOpportunity || selectedTime || selectedCompetency) &&
        <a href={window.location.pathname}
           style={{cursor: "pointer", fontSize: "2rem"}}>
          Clear all filters
          <span aria-hidden="true">
            <i class="fas fa-times" style={{
              display: "inline-block",
              paddingLeft: ".6rem",
              position: "relative",
              top: "2px"
            }}></i>
          </span>
        </a>
      }

    </form>
  )
}

const island = createIslandWebComponent('gradgrow-filters', GradGrowFilters)
island.render({
  selector: `#gradgrow-filters-island`,
})
