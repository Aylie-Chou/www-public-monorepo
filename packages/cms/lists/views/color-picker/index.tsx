import styled from '@emotion/styled'
import { CellContainer } from '@keystone-6/core/admin-ui/components'
import type {
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
import {
  FieldContainer,
  FieldDescription,
  FieldLabel,
} from '../../../admin/components/controls'
import type React from 'react'
import { HexColorPicker } from 'react-colorful'
import { EyeDropper, isSupportEyeDropper } from './eye-dropper'

const DEFAULT_COLOR = '#9F7544'

const ColorContainer = styled.div`
  width: 454px;
  border-radius: 5px;
  border: 1px solid #e1e5e9;
  padding: 8px;

  .react-colorful {
    width: 100%;
    height: auto;
  }
  .react-colorful__saturation,
  .react-colorful__last-control {
    border-radius: 0;
  }
  .react-colorful__saturation {
    height: 100px;
  }
  .react-colorful__last-control {
    margin-top: 8px;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`
const CurrentColor = styled.div`
  width: 45px;
  height: 45px;
  background-color: ${(props) => props.color};
`
const EyeDropperWithStyle = styled(EyeDropper)`
  color: rgb(55, 65, 81);
  height: 25px;
  width: 30px;
  margin-left: 6px;
`
const InputContainer = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
`
const Input = styled.input`
  padding: 4px 0;
  border: 1px solid #e1e5e9;
  text-align: center;
  width: ${(props) => props.width};
`
const Label = styled.div`
  font-size: 12px;
`

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return {
    r: result ? parseInt(result[1], 16) : 0,
    g: result ? parseInt(result[2], 16) : 0,
    b: result ? parseInt(result[3], 16) : 0,
  }
}

const InputWithLabel = ({
  type = 'text',
  label = '',
  value,
  onChange,
  changeKey = '',
  width = '100px',
}: {
  type?: string
  label: string
  value: number | string
  onChange: (k: string, v: string | number) => void
  changeKey: string
  width?: string
}) => {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onChange(changeKey, e.target.value)
  }
  return (
    <InputContainer>
      <Input value={value} onChange={onInputChange} width={width} type={type} />
      <Label>{label}</Label>
    </InputContainer>
  )
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const color = value || DEFAULT_COLOR
  const setColor = (nextColor: string) => {
    if (nextColor !== color) onChange?.(nextColor)
  }
  const rgbColor = hexToRgb(color)
  const onRgbChange = (key: string, value: string | number) => {
    if (!['r', 'g', 'b'].includes(key) || Number.isNaN(Number(value))) {
      throw new Error('Invalid key or value')
    }
    rgbColor[key as 'r' | 'g' | 'b'] = Number(value)
    setColor(rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b))
  }
  const onHexChange = (_key: string, value: string | number) => {
    setColor(String(value))
  }
  const EyeDropperJSX = isSupportEyeDropper ? (
    <EyeDropperWithStyle onPickColor={setColor} />
  ) : null

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.fieldKey}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.fieldKey}-description`}>
        {field.description}
      </FieldDescription>
      <ColorContainer>
        <HexColorPicker color={color} onChange={setColor} />
        <Row>
          <CurrentColor color={color}></CurrentColor>
          {EyeDropperJSX}
          <InputWithLabel
            changeKey="r"
            label="R"
            value={rgbColor.r}
            width="75px"
            onChange={onRgbChange}
          />
          <InputWithLabel
            changeKey="g"
            label="G"
            value={rgbColor.g}
            width="75px"
            onChange={onRgbChange}
          />
          <InputWithLabel
            changeKey="b"
            label="B"
            value={rgbColor.b}
            width="75px"
            onChange={onRgbChange}
          />
          <InputWithLabel
            changeKey="hex"
            label="Hex"
            value={color}
            onChange={onHexChange}
          />
        </Row>
      </ColorContainer>
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ value }) => (
  <CellContainer>{value == null ? '' : String(value)}</CellContainer>
)

export const controller = (
  config: FieldControllerConfig<any>
): FieldController<string | null, string> => {
  return {
    fieldKey: config.fieldKey,
    label: config.label,
    description: config.description,
    graphqlSelection: config.fieldKey,
    defaultValue: DEFAULT_COLOR,
    deserialize: (data) => {
      const value = data[config.fieldKey]
      return typeof value === 'string' ? value : null
    },
    serialize: (value) => ({ [config.fieldKey]: value }),
  }
}
