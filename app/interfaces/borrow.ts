/* eslint-disable*/

export interface ResBorrow {
  data: ResBorrowData[]
  status: number
}

export interface ResBorrowData {
  id: number
  project: string
  name: string
  lastname: string
  tel: string
  other_tel: any
  mentor_name: any
  mentor_last: any
  img_sign: any
  status: number
  createAt: string
  retureAt: string
  serveAt: string
  origanizationId: number
  origanization: Origanization
  Borrow_detail: BorrowDetail[]
}

export interface Origanization {
  id: number
  name: string
  group: any
  createAt: string
  updateAt: string
}

export interface BorrowDetail {
  quantity: number
  id: number
  item_status: string
  setId: number
  itemId: number
  borrowId: number
  item: Item
  set: Set
}
export interface Item {
  id: number
  name: string
  img: string
  status: string
  createAt: string
  updateAt: string
  qrId: any
  divisionId: number
  postfixId: number
  division: Division
  postfix: Postfix
  qr: any
}

export interface Division {
  id: number
  name: string
  email: string
  createAt: string
  updateAt: string
}

export interface Postfix {
  id: number
  name: string
}

export interface Set {
  id: number
  name: string
  createAt: string
  updateAt: string
  Item_set: ItemSet[]
}

export interface ItemSet {
  id: number
  setId: number
  itemId: number
  item: ItemInSet
}

export interface ItemInSet {
  id: number
  name: string
  img?: string
  status: string
  createAt: string
  updateAt: string
  qrId: any
  divisionId: number
  postfixId: number
}

/* eslint-disable*/
