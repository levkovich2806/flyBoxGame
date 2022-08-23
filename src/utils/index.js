export function takeXY(e) {
    let x;
    let y;

    if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
        const touch = e.targetTouches[0] || e.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (e.type === 'click' || e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover'|| e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
        x = e.clientX;
        y = e.clientY;
    }

    return {x, y};
}
