import Select, { GroupBase } from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

export default (props: StateManagerProps<any, false, GroupBase<any>>) => {
  return (
    <Select
      styles={{
        option: (baseStyles, _) => ({ ...baseStyles, wordBreak: 'break-word' }),
      }}
      loadingMessage={() => 'Загрузка...'}
      noOptionsMessage={() => 'Пусто :('}
      placeholder="Выберите..."
      {...props}
    />
  )
}
