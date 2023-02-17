import './Home.styles.scss'
import { getCategories, getTemplate } from 'api/api'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Select from 'components/Select'
import CustomSelectMenuList from './SelectGroup'
import OfficeElement from 'pages/Home/OfficeElement/OfficeElement'
export interface categoriesParamsType {
  offset: number
  count: number
}

const ParamsDefaultValues: categoriesParamsType = { offset: 0, count: 15 }

export default function Home() {
  const [categoriesParams, setCategoriesParams] = useState(ParamsDefaultValues)
  const [categoriesData, setCategoriesData] = useState([])
  const [templateData, setTemplateData] = useState([])

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

  const loadTemplate = async (option: any) => {
    const data = await template.mutateAsync(option.Id)
    setTemplateData(data)
  }
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
      <OfficeElement />

      {/*//TODO create pagination*/}
      <Select
        options={categoriesData}
        getOptionLabel={(option) => option.Title}
        isLoading={categories.isLoading}
        onChange={loadTemplate}
        components={{ MenuList: CustomSelectMenuList }}
        placeholder="категории..."
        className="home__select"
      />
      <Select
        placeholder="шаблоны..."
        className="home__select"
        options={templateData}
        getOptionLabel={(option) => option.Title}
        isLoading={template.isLoading}
      />

      <button onClick={logOut} className="btn-text-default logout-btn">
        Выйти
      </button>
    </div>
  )
}
