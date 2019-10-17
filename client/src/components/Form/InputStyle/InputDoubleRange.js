import React from 'react'
import { Content, Columns } from 'react-bulma-components'
import Slider, { Range } from 'rc-slider'

import 'rc-slider/assets/index.css'

const SliderWithTooltip = Slider.createSliderWithTooltip
const RangeWithTooltip = SliderWithTooltip(Range)

function DoubleRange(props) {
  return (
    <Columns.Column size={4}>
      <div className='slider'>
        <Content>
          <p>{props.label}</p>
          <RangeWithTooltip
            min={props.min}
            max={props.max}
            defaultValue={props.defaultValues}
            tipFormatter={value => `value : ${value}`}
            marks={{
              [props.min]: props.min,
              [props.range[0]]: props.range[0],
              [props.range[1]]: props.range[1],
              [props.max]: props.max
            }}
            onChange={e =>
              props.onChange({ value: e, name: props.name, type: 'range' })
            }
          />
        </Content>
      </div>
    </Columns.Column>
  )
}

export default DoubleRange
