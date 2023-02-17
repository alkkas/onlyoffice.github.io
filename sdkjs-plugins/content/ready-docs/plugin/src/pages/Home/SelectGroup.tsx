import { components, MenuListProps } from 'react-select'
import './SelectGroup.styles.scss'

const CustomSelectMenuList = (props: MenuListProps<any, false, any>) => {
  return (
    <>
      <components.MenuList {...props}>
        {props.children}

        {Array.isArray(props.children) && (
          <button className="load_more btn-text-default">
            загрузить больше
          </button>
        )}
      </components.MenuList>
    </>
  )
}

export default CustomSelectMenuList
