import React, { useState } from 'react'
import Slider, { Range } from 'rc-slider'

import 'rc-slider/assets/index.css'

const SliderWithTooltip = Slider.createSliderWithTooltip
const RangeWithTooltip = SliderWithTooltip(Range)

const controlledRange = [18, 99]
const defaultRange = [18, 44] // comment on l'obtient ca ?

function DoubleRange(props) {
  const [range, setRange] = useState(defaultRange)

  function handleChange(e) {
    if (e[0] >= controlledRange[0] && e[1] <= controlledRange[1]) setRange(e)
  }

  return (
    <RangeWithTooltip
      name='test'
      min={controlledRange[0]}
      max={controlledRange[1]}
      defaultValue={defaultRange}
      tipFormatter={value => `value : ${value}`}
      marks={{
        [controlledRange[0]]: controlledRange[0],
        [props.range[0]]: props.range[0],
        [props.range[1]]: props.range[1],
        [controlledRange[1]]: controlledRange[1]
      }}
      onChange={e =>
        props.onChange({ value: e, name: props.name, type: 'range' })
      }
    />
  )
}

export default DoubleRange
