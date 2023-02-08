import { components, MenuListProps } from 'react-select'

const CustomSelectMenuList = (props: MenuListProps<any, false, any>) => {
  return (
    <>
      <components.MenuList {...props}>
        {props.children}

        <span>загрузить больше</span>
      </components.MenuList>
    </>
  )
}

export default CustomSelectMenuList
