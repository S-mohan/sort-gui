import { IRenderHooks, TRenderData } from '../defined'
import Render from '../render'
import RenderHelper from '../helper'
import Sort from './sort'


/**
 * 选择排序
 *
 * @export
 * @class SelectionSort
 * @extends {RenderHelper}
 */
export default class SelectionSort extends Sort {

  /**
   * 静态排序方法
   * 
   * @static
   * @example
   * SelectionSort.sort([1, 2, 3])
   * @param {TRenderData} data
   * @returns {TRenderData}
   * @memberof SelectionSort
   */
  static sort(data: TRenderData): TRenderData {
    const size = data.length
    for (let i = 0; i < size; i++) {
      let minIndex = i
      for (let j = i + 1; j < size; j++) {
        if (data[j] < data[minIndex]) {
          minIndex = j
        }
      }
      RenderHelper.swap(data, i, minIndex)
    }
    return data
  }


  /**
   * Creates an instance of SelectionSort.
   * @param {TRenderData} data
   * @param {Render} [render]
   * @param {IRenderHooks} [hooks]
   * @memberof SelectionSort
   */
  constructor(data: TRenderData, render?: Render, hooks?: IRenderHooks) {
    super(data, render, [
      {
        color: RenderHelper.Colors.Default,
        name: '待排序'
      },
      {
        color: RenderHelper.Colors.Sorted,
        name: '已排序'
      },
      {
        color: RenderHelper.Colors.Current,
        name: '当前最小值'
      },
      {
        color: RenderHelper.Colors.CurrentCompared,
        name: '当前比较值'
      },
    ], hooks)
  }


  /**
   * 带渲染排序
   *
   * @private
   * @returns {Generator<Promise<any>>}
   * @memberof SelectionSort
   */
  protected *sort(): Generator<Promise<any>> {
    const { data, size } = this
    yield this.draw(0, -1, -1)
    for (let i = 0; i < size; i++) {
      let minIndex = i
      yield this.draw(i, -1, minIndex)
      for (let j = i + 1; j < size; j++) {
        yield this.draw(i, j, minIndex)
        if (data[j] < data[minIndex]) {
          minIndex = j
          yield this.draw(i, j, minIndex)
        }
      }
      this.swap(i, minIndex)
      yield this.draw(i + 1, -1, minIndex)
    }
    yield this.draw(size, -1, -1)
  }


  /**
   * 返回每一帧的渲染迭代器，并且在渲染前设置不同的色彩
   *
   * @protected
   * @param {number} sortedIndex
   * @param {number} currentComparedIndex
   * @param {number} currentMinIndex
   * @returns {Promise<any>}
   * @memberof SelectionSort
   */
  protected draw(sortedIndex: number, currentComparedIndex: number, currentMinIndex: number): Promise<any> {
    return this.render(this.data, (ctx: CanvasRenderingContext2D, index: number) => {
      if (index < sortedIndex) {
        ctx.fillStyle = RenderHelper.Colors.Sorted
      } else {
        ctx.fillStyle = RenderHelper.Colors.Default
      }

      if (index === currentComparedIndex) {
        ctx.fillStyle = RenderHelper.Colors.CurrentCompared
      }

      if (index === currentMinIndex) {
        ctx.fillStyle = RenderHelper.Colors.Current
      }
    })
  }
  
}