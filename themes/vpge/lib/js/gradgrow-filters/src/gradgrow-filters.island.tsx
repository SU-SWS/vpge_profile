import {createIslandWebComponent} from 'preact-island'
import {useEffect, useState} from "preact/compat";
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


  const [competencyOptions, setCompetencyOptions] = useState([])
  const [opportunityOptions, setOpportunityOptions] = useState([])
  const [timeOptions, setTimeOptions] = useState([])

  const [selectedCompetency, setSelectedCompetency] = useState('')
  const [selectedSubCompetency, setSelectedSubCompetency] = useState('')
  const [selectedOpportunity, setSelectedOpportunity] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const getSelectOptions = (elementId) => {
    const selectOptions = [];

    const options = document.getElementById(elementId).children;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const value = option.getAttribute('value')
      const label = option.textContent;
      if (value === 'All' || label.startsWith('--')) continue;

      if (label.startsWith('-')) {
        selectOptions[selectOptions.length - 1].below.push({value, label: label.substring(1)})
        continue;
      }
      selectOptions.push({value, label, below: []});
    }
    return selectOptions;
  }


  useEffect(() => {
    // Add some css directly to the head so it applies even after ajax.
    const css = '#views-exposed-form-vpge-grad-grow-filters-block { display: none; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));


    setCompetencyOptions(getSelectOptions('edit-competency'))
    setOpportunityOptions(getSelectOptions('edit-content-type'))
    setTimeOptions(getSelectOptions('edit-commitment'))
  }, [])

  useEffect(() => {
    if (selectedSubCompetency) {
      document.querySelector('[id^="edit-competency"]').value = selectedSubCompetency
      return;
    }
    document.querySelector('[id^="edit-competency"]').value = selectedCompetency
  }, [selectedCompetency, selectedSubCompetency]);

  useEffect(() => {
    document.querySelector('[id^="edit-content-type"]').value = selectedOpportunity
  }, [selectedOpportunity]);

  useEffect(() => {
    document.querySelector('[id^="edit-commitment"]').value = selectedTime
  }, [selectedTime]);

  const subCompetencies = competencyOptions.find(item => item.value === selectedCompetency)?.below || [];

  const submit = (e) => {
    e.preventDefault()
    document.querySelector('[id^="edit-submit-vpge-grad-grow"]').click()
  }
  const reset = (e) => {
    e.preventDefault();
    window.location = window.location.pathname;
  }

  return (
    <form style={{
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      borderBottom: "1px solid black",
      paddingBottom:"13.3rem",
      marginBottom: "2.7rem"
    }}>
      <fieldset style={{padding: 0}}>
        <legend style={{fontSize: "24px", marginBottom: "15px"}}>Filter by Competency</legend>

        <FilterContainer>
          <div>
            <SelectList
              options={competencyOptions}
              label="Competency"
              emptyLabel="- Any -"
              onChange={(e, value) => setSelectedCompetency(value)}
            />
          </div>
          <div>
            <SelectList
              options={subCompetencies}
              disabled={subCompetencies.length === 0}
              label="Sub-Competency"
              emptyLabel="- Any -"
              onChange={(e, value) => setSelectedSubCompetency(value)}
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
          />
        </div>

        <div>
          <SelectList
            options={timeOptions}
            label="Filter by Time Commitment"
            emptyLabel="- Any -"
            onChange={(e, value) => setSelectedTime(value)}
          />
        </div>
      </FilterContainer>
      <button onClick={submit} style={{width: "fit-content"}}>Apply Filters
      </button>

      {(selectedOpportunity || selectedTime || selectedCompetency) &&
        <a onClick={reset} style={{cursor: "pointer", fontSize: "2rem"}}>
          Clear all filters
          <span aria-hidden="true">
            <i class="fas fa-times" style={{display: "inline-block", paddingLeft: ".6rem", position: "relative", top: "2px"}}></i>
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
