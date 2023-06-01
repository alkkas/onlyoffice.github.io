declare global {
  interface Window {
    Asc: any
  }
}

export type anyObject = { [i: string]: any }

type diffOperator = 0 | 1 | 2

//TODO this two type must contain unique id

export type ElementStructCondition = {
  elementName: string
  operatorType: diffOperator
  value: string
}

export type DocumentConditions = {
  docName: string
  elementName: string
  operatorType: diffOperator
  value: string
}

interface Entity {
  Id: string
  Title: string
}
export interface ElementStruct {
  case: 0 | 1 | 2 | 3 | 4 | 5
  displayConditions: ElementStructCondition[]
  docs: DocumentConditions[]
  isHidden: boolean
  parentName: string
  struct: string[]
  typeId: 4 | 5 | 6 | 7 | 8
}

export interface Element extends Entity {
  Struct: ElementStruct
  TemplateId: string
  Type: '4' | '5' | '6' | '7' | '8'
  isChanged: '1' | null
}

export interface DocumentItem extends Entity {
  CategoryId: string
  Filename: string
  Translated: string
  UserId: string
}
