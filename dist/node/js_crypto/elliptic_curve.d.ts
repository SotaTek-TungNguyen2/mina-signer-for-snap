export { Pallas, Vesta, GroupAffine, GroupProjective };
declare type GroupProjective = {
    x: bigint;
    y: bigint;
    z: bigint;
};
declare type GroupAffine = {
    x: bigint;
    y: bigint;
    infinity: boolean;
};
declare const Pallas: {
    one: GroupProjective;
    endoBase: bigint;
    endoScalar: bigint;
    add(g: GroupProjective, h: GroupProjective): GroupProjective;
    negate(g: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    sub(g: GroupProjective, h: GroupProjective): GroupProjective;
    scale(g: GroupProjective, s: bigint): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    toAffine(g: GroupProjective): GroupAffine;
    ofAffine({ x, y }: GroupAffine): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
};
declare const Vesta: {
    one: GroupProjective;
    endoBase: bigint;
    endoScalar: bigint;
    add(g: GroupProjective, h: GroupProjective): GroupProjective;
    negate(g: GroupProjective): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    sub(g: GroupProjective, h: GroupProjective): GroupProjective;
    scale(g: GroupProjective, s: bigint): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
    toAffine(g: GroupProjective): GroupAffine;
    ofAffine({ x, y }: GroupAffine): {
        x: bigint;
        y: bigint;
        z: bigint;
    };
};
