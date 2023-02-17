import { getCategories, getTemplate } from 'api/api'
import Select from 'components/Select'
import OfficeElement from 'pages/Home/OfficeElement/OfficeElement'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import './Home.styles.scss'
import CustomSelectMenuList from './SelectGroup'

export interface categoriesParamsType {
  offset: number
  count: number
}

const ParamsDefaultValues: categoriesParamsType = { offset: 0, count: 15 }
export const TemplateIdContext = createContext<string[]>([])

export default function Home() {
  const [categoriesParams, setCategoriesParams] = useState(ParamsDefaultValues)

  const categories = useMutation(getCategories, {
    onError: () => {
      toast.error(
        'Не удалось загрузить категории, попробуйте перезапустить плагин!'
      )
    },
  })
  const template = useMutation(getTemplate, {
    onError: () => {
      toast.error(
        'Не удалось загрузить шаблон, попробуйте перезапустить плагин!'
      )
    },
  })
  const currentTemplateIds = useMemo(
    () => template?.data?.map((template: any) => template.Id),
    [template.data]
  )

  const loadTemplate = (option: any) => {
    template.mutate(option.Id)
  }
  const getCategoriesFunc = () => {
    categories.mutate(categoriesParams)
  }

  useEffect(() => {
    getCategoriesFunc()
  }, [])

  const logOut = () => {
    localStorage.removeItem('access_token')
    location.reload()
  }

  return (
    <div>
      <TemplateIdContext.Provider value={currentTemplateIds}>
        <OfficeElement />
      </TemplateIdContext.Provider>
      {/*//TODO create pagination*/}
      <Select
        options={categories.data}
        getOptionLabel={(option) => option.Title}
        isLoading={categories.isLoading}
        getOptionValue={(option) => option.Id}
        onChange={loadTemplate}
        components={{ MenuList: CustomSelectMenuList }}
        placeholder="категории..."
        className="home__select"
      />
      <Select
        placeholder="шаблоны..."
        className="home__select"
        options={template.data}
        getOptionLabel={(option) => option.Filename}
        isLoading={template.isLoading}
        getOptionValue={(option) => option.Id}
      />

      <button onClick={logOut} className="btn-text-default logout-btn">
        Выйти
      </button>
    </div>
  )
}
