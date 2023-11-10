import {createIslandWebComponent} from 'preact-island'
import {useEffect, useState} from "preact/compat";
import SelectList from "./select-list";


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
      if (value === 'All') continue;

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
    <form style={{display: "flex", flexDirection:"column", gap: "40px"}}>
      <fieldset style={{padding: 0}}>
        <legend>Filter by Competency</legend>

        <div style={{display: "flex", gap: "40px", justifyContent: "space-between"}}>
          <div style={{flex: "1 1 0px"}}>
            <SelectList
              options={competencyOptions}
              label="Competency"
              emptyLabel="- Any -"
              onChange={(e, value) => setSelectedCompetency(value)}
            />
          </div>
          <div style={{flex: "1 1 0px"}}>
            {subCompetencies.length > 0 &&
              <SelectList
                options={subCompetencies}
                label="Sub-Competency"
                emptyLabel="- Any -"
                onChange={(e, value) => setSelectedSubCompetency(value)}
              />
            }
          </div>
        </div>
      </fieldset>

      <div style={{display: "flex", gap: "40px", justifyContent: "space-between"}}>
        <div style={{flex: "1 1 0px"}}>
          <SelectList
            options={opportunityOptions}
            label="Filter by Learning Opportunity"
            emptyLabel="- Any -"
            onChange={(e, value) => setSelectedOpportunity(value)}
          />
        </div>

        <div style={{flex: "1 1 0px"}}>
          <SelectList
            options={timeOptions}
            label="Filter by Time Commitment"
            emptyLabel="- Any -"
            onChange={(e, value) => setSelectedTime(value)}
          />
        </div>
      </div>
      <div style={{display: "flex", gap: "20px"}}>
        <button onClick={submit}>Apply Filters
        </button>

        {(selectedOpportunity || selectedTime || selectedCompetency) &&
          <button onClick={reset}>
            Reset Filters
          </button>
        }
      </div>

    </form>
  )
}


const island = createIslandWebComponent('gradgrow-filters', GradGrowFilters)
island.render({
  selector: `#gradgrow-filters-island`,
})
