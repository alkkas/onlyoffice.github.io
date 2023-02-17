import Select from 'components/Select'

const typeOptions = [
  { type: 'input', label: 'Поле для ввода' },
  { type: 'text', label: 'Текст' },
  { type: 'radio', label: 'Выбор' },
  { type: 'checkbox', label: 'Список' },
  { type: 'complexList', label: 'Нефиксированный список' },
]

export default () => {
  return (
    <>
      <h2 className="office-element__title">Свойства элемента:</h2>
      <Select placeholder="Название элемента" />
      <Select placeholder="тип элемента" options={typeOptions} />
    </>
  )
}
