import React from "react";

export default function Bombs({value}) {
    let v = value.toString();
    while (v.length < 3) v = '0' + v;
    if (value > 999) v = '999';
    if (value < 0 && value > -10) v = v[1] + v[0] + v[2];
    if (value < -99) v = '-99';
    return <p id='bombs' className="num">{v}</p>
}