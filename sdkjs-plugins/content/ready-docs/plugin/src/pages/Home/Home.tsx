import { getCategories, getTemplate } from 'api/api'
import Button from 'components/Button'
import Select from 'components/Select'
import OfficeElement from 'pages/Home/OfficeElement/OfficeElement'
import { createContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { DocumentItem } from 'types/types'
import './Home.styles.scss'
import CustomSelectMenuList from './SelectGroup'

export interface categoriesParamsType {
  offset: number
  count: number
}

const ParamsDefaultValues: categoriesParamsType = { offset: 0, count: 15 }
export const TemplateContext = createContext<DocumentItem[]>([])

export default function Home() {
  const [categoriesParams, setCategoriesParams] = useState(ParamsDefaultValues)
  const [category, setCategory] = useState(null)
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

  const changeCategory = (option: DocumentItem) => {
    setCategory(option)
    loadTemplate(option)
  }

  return (
    <div>
      <TemplateContext.Provider value={template.data}>
        <OfficeElement categoryId={category?.Id} />
      </TemplateContext.Provider>
      {/*TODO create pagination*/}
      {/*TODO mb remove documents from page at all because that don't play part in flow process*/}
      <Select
        options={categories.data}
        getOptionLabel={(option) => option.Title}
        isLoading={categories.isLoading}
        getOptionValue={(option) => option.Id}
        value={categories?.data?.find(
          (item: DocumentItem) => item.Id === category?.Id
        )}
        onChange={changeCategory}
        components={{ MenuList: CustomSelectMenuList }}
        placeholder="категории..."
        className="home__select"
      />
      <Select
        placeholder="документы..."
        className="home__select"
        options={template.data}
        getOptionLabel={(option) => option.Filename}
        isLoading={template.isLoading}
        getOptionValue={(option) => option.Id}
      />
      <Button onClick={logOut} type="submit" style={{ marginBottom: 15 }}>
        Выйти
      </Button>
    </div>
  )
}
