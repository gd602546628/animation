/**
 * Created by gd on 2017/5/9.
 */

/*
*animation方法接收4个参数  el:需要动画的元素,
*                        obj:动画属性JSON {left:100,translateY:100},
*                        duration:持续时间,
*                        easing:动画算法，Linear，Quad.easeIn,详细看tween.ts
*                        callback:动画完成的回调
*
*getTransform方法接收3个参数，el:元素，attr:transform的值 ，translateY,rotate,scale    value：值。
*
*如果要以tramsform属性进行动画，需对有transtorm初始值的元素进行初始化
如：  一个元素初始位置为transform:translateY(30px), 需调此方法  getTransform(el,'translateY',30)
如果没有初始值，则不用管。


*
* */




import Tween from './tween'

 class Animation{
    getStyle(el, attr) {//获取计算样式
        return parseInt(getComputedStyle(el)[attr]);
    }

    getTransform(el, attr, value) {//获取设置transform
        let translateArr = ["translateX", "translateY", "translateZ"];
        let scaleArr = ["scale", "scaleX", "scaleY"];
        let rotateArr = ["rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];
        let valueStr = ''
        if (!el.transform) {
            el.transform = {};
        }
        if (arguments.length > 2) {//设置
            el.transform[attr] = value;
            for (let key in el.transform) {
                if (translateArr.indexOf(key) !== -1) {
                    valueStr += `${key}(${el.transform[key]}px) `;
                } else if (scaleArr.indexOf(key) !== -1) {
                    valueStr += `${key}(${el.transform[key]}) `;
                } else if (rotateArr.indexOf(key) !== -1) {
                    valueStr += `${key}(${el.transform[key]}deg) `;
                }
            }

            el.style.webkitTransform = el.style.transform = valueStr
        } else {//获取
            let val = el.transform[attr];
            if (typeof val == 'undefined') {
                if (scaleArr.indexOf(attr) !== -1) {
                    val = 1
                } else {
                    val = 0
                }
            }
            return val;
        }
    }

    animation(el, obj, duration, easing, callBack) {


        let _this = this;
        let targetArr = [];
        let getValue = null;
        let easingArr = easing.split('.');
        if (easingArr.length == 1) {
            getValue = function (t, b, c, d) {
                return Tween[easingArr[0]](t, b, c, d)
            }
        } else if (easingArr.length == 2) {
            getValue = function (t, b, c, d) {
                return Tween[easingArr[0]][easingArr[1]](t, b, c, d)
            }
        }
        let transformTest = /translate|scale|rotate|skew/;
        for (let key in obj) {
            if (transformTest.test(key)) {
                let resultObj = {
                    attr: key,
                    target: obj[key],
                    current: _this.getTransform(el, key)
                };
                targetArr.push(resultObj)
            } else {
                let resultObj = {
                    attr: key,
                    target: obj[key],
                    current: _this.getStyle(el, key)
                };
                targetArr.push(resultObj)
            }

        }


        let start = 0;

        function step() {
            let dura = Math.ceil(duration / 17);
            if (start <= dura) {
                for (let item of targetArr) {
                    let {attr, current, target}=item;
                    let value = getValue(start, current, target - current, dura);
                    if (transformTest.test(attr)) {
                        _this.getTransform(el, attr, value)
                    } else {
                        el.style[attr] = value + 'px';
                    }
                }
                start++;
                requestAnimationFrame(step)
            } else {
                if (typeof  callBack == 'function') {
                    callBack()
                }

            }

        }

        step();

    }

}

export default new Animation()