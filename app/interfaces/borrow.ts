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
  origanizationId: any
  origanization: any
  Borrow_detail: BorrowDetail[]
}

export interface BorrowDetail {
  id: number
  setId: any
  itemId: number
  borrowId: number
  item: Item
  set: any
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
}


/* eslint-disable*/
