export interface ResChart {
    xaxis: string[]
    series: Series[]
    status: number
  }
  
  export interface Series {
    name: string
    data: number[]
  }
  