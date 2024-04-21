import { ChartData } from 'chart.js'
import { parseISO } from 'date-fns'
import { EGraphType } from '../enums/EGraphType'
import {EFormatType} from '../enums/format-type.enum.ts'

const makeArrayForTotal = (arr: any) => {
    const totalArray: any = []
    arr.reduce((acc: any, cur: any, index: number) => {
        if (index === 1) totalArray.push([0, acc])
        totalArray.push([acc, cur])
        return cur
    })
    return totalArray
}

const sumValues = (elem: any) => {
    return elem.reduce((acc: any, cur: any) => acc + cur, 0)
}

type TSummary = {
    sum?: any
    max?: any
    min?: any
    last?: any
    avg?: any
    count?: any
}

type TMeasure = {
    value: any
    time: string
}

export type TDataset = {
    color: string
    title: string
    inverted: boolean
    valueFormat: EFormatType
    measures: TMeasure[]
    summary?: TSummary
}

interface IOptions {
    graphType: EGraphType
    datasets: TDataset[]
}


export const processData = (options: IOptions): ChartData<any> => {
    const {
        graphType,
        datasets
    } = options

    //Установка лэйблов к каждому датасету.
    let labels
    if (graphType === EGraphType.PIE) {
        labels = datasets.map((dataset) => dataset.title)
    } else {
        labels = datasets.length
            ? datasets[0].measures.map((measure) => parseISO(measure.time))
            : []
    }

    let processedDatasets: any[] = []
    if (graphType === EGraphType.PIE) {
        /* В рамках работы с PIE режимом отображения логика иная,
        * все датасеты сводятся к одному датасету ввиду специфики интерфейса
        * ChartJS для данного типа диаграмм */
        const dataCur: any[] = []
        const borderColorArr: string[] = []
        const backgroundColorArr: string[] = []
        datasets.forEach((dataset) => {
            const values = dataset.measures.map((measure) => measure.value)
            dataCur.push(sumValues(values))
            borderColorArr.push(dataset.color)
            backgroundColorArr.push(dataset.color)
        })
        processedDatasets.push({
            data: dataCur,
            borderColor: borderColorArr,
            backgroundColor: backgroundColorArr,
        })
    } else {
        datasets.forEach((dataset, index) => {
            let values = dataset.measures.map((measure) => measure.value)
            if (dataset.inverted) {
                values = values.reverse()
            }
            const typeOfStack = (graphType === EGraphType.STACK && index === 1)
            processedDatasets.push({
                label: `${dataset.title}, ${dataset.summary?.min}, ${dataset.summary?.max}, ${dataset.summary?.avg}, ${dataset.summary?.last}, ${dataset.summary?.sum}`,
                data: graphType === EGraphType.TOTAL ? makeArrayForTotal(values) : values,
                borderColor: dataset.color,
                backgroundColor: graphType === EGraphType.AREA ? `${dataset.color}80` : dataset.color,
                type: typeOfStack && 'line',
                borderRadius: graphType === EGraphType.TOTAL && Number.MAX_VALUE,
                borderSkipped: false,
                spanGaps: false,
                fill: graphType === EGraphType.AREA,
            })
        })
    }

    processedDatasets = processedDatasets.sort((a: any, b: any) => sumValues(a.data) > sumValues(b.data) ? 1 : -1)

    if (graphType === EGraphType.TOTAL) {
        const currentColor: any = []
        processedDatasets.map((elem: any) => elem.data.map((val: any) => {
            val[0] < val[1] ? currentColor.push('#FB8832') : currentColor.push('#007AFF')
        }))
        processedDatasets.forEach((elem: any) => elem.backgroundColor = currentColor)
        console.log(processedDatasets, 'haha')
        for (const dataset of processedDatasets) {
            for (let i = 0; i < dataset.data.length; i++) {
                if (dataset.data[i].includes(null)) {
                    dataset.data[i] = [null,null]
                }
            }
        }
    }

    return {
        labels: labels,
        datasets: processedDatasets
    }
}