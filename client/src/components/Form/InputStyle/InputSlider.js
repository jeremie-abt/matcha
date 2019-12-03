import React from 'react'
import { Content, Columns } from 'react-bulma-components'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider)

const controlledRange = [10, 200]

function InputSlider(props) {
  return (
    <Columns.Column size={4}>
      <div className='slider'>
        <Content>
          <p>{props.label}</p>
          <SliderWithTooltip
            min={controlledRange[0]}
            max={controlledRange[1]}
            defaultValue={props.defaultValue}
            value={props.range}
            tipFormatter={value => `value : ${value}`}
            marks={{
              [controlledRange[0]]: controlledRange[0],
              [controlledRange[1]]: controlledRange[1]
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

export default InputSlider
