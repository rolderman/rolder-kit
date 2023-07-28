import { Indicator } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

export default function DateTimePicker_v0_1_0(props) {
  const { formHook, formField, dateFormat, limitMinDate, daysOffset } = props

  return (
    <DateTimePicker
      renderDay={(date) => {
        const day = date.getDate()
        return (
          <Indicator size={6} color="blue" offset={-5} disabled={dayjs(date).dayOfYear() !== dayjs().dayOfYear()}>
            <div>{day}</div>
          </Indicator>
        )
      }}
      icon={<IconCalendar size="1.25rem" stroke={1.5} />}
      valueFormat={dateFormat}
      minDate={limitMinDate && dayjs().add(daysOffset, 'day').toDate()}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}