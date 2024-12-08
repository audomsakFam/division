/* eslint-disable*/

export interface ResItemsGroup {
  name: string
  statusCounts: StatusCount[]
  divisionName: string
  postfixName: string
  img: string
  itemSets: ItemSet[]
}

export interface StatusCount {
  status: string
  count: number
}

export interface ItemSet {
  setName: string
}

export interface ResItemDetial {
    msg: string
    data: resItemDetialData[]
    status: number
  }
  
  export interface resItemDetialData {
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
/* eslint-disable*/
  