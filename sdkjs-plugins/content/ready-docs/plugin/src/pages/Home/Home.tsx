import { getCategories } from 'api/api'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { debounce } from 'utils/utils'
import CustomSelectMenuList from './SelectGroup'
export interface categoriesParamsType {
  offset: number
  count: number
}

const ParamsDefaultValues: categoriesParamsType = { offset: 0, count: 15 }

export default function Home() {
  const [categoriesParams, setCategoriesParams] = useState(ParamsDefaultValues)
  const [categoriesData, setCategoriesData] = useState([])

  const categories = useMutation(getCategories, {
    onError: () => {
      toast.error('Не удалось загрузить категории, перезапустите плагин!')
    },
  })

  const getCategoriesFunc = async () => {
    const data = await categories.mutateAsync(categoriesParams)
    setCategoriesData(data)
  }

  useEffect(() => {
    getCategoriesFunc()
  }, [])

  const logOut = () => {
    window.localStorage.removeItem('access_token')
    window.location.reload()
  }

  return (
    <div>
      <button className="btn-text-default">Создать элемент</button>
      <Select<any>
        placeholder="категории..."
        options={categoriesData}
        getOptionLabel={(option: any) => option.Title}
        isLoading={categories.isLoading}
        loadingMessage={() => 'Загрузка...'}
        noOptionsMessage={() => 'Пусто :('}
        components={{ MenuList: CustomSelectMenuList }}
      />
      <button onClick={logOut} className="btn-text-default">
        Выйти
      </button>
    </div>
  )
}
