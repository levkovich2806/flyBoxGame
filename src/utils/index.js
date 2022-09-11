export function takeXY(e) {
    let x;
    let y;

    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
        const touch = e.targetTouches[0] || e.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (e.type === 'click' || e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
        x = e.clientX;
        y = e.clientY;
    }

    return {x, y};
}

export function dateHelperFactory() {
    const padZero = (val, len = 2) => `${val}`.padStart(len, `0`);
    const setValues = date => {
        let vals = {
            yyyy: date.getFullYear(),
            m: date.getMonth()+1,
            d: date.getDate(),
            h: date.getHours(),
            mi: date.getMinutes(),
            s: date.getSeconds(),
            ms: date.getMilliseconds(), };
        Object.keys(vals).filter(k => k !== `yyyy`).forEach(k =>
            vals[k[0]+k] = padZero(vals[k], k === `ms` && 3 || 2) );
        return vals;
    };

    return date => ( {
        values: setValues(date),
        toArr(...items) { return items.map(i => this.values[i]); },
    } );
}

// TODO we don't need really random - we can just increment by 1 colors and return each time a new rgb color
export function getRandomColor() {
    const randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    return {rgbString: `rgb(${randomColors[0]} , ${randomColors[1]}, ${randomColors[2]})`, randomColors};
}

