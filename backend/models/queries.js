// Query Strings for database geometries
// called from /models/geometry

const qOSMPointVector = `
    MATCH (n:OSMPoint {subtype:$subtype})-->(vec:Vector)
    WITH n.key as dynamicKey, 
    { position:vec.position } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedVectors
    RETURN REDUCE(s={}, x IN collect(keyedVectors) | apoc.map.merge(s,x)) as subList
`;

const qTransitPointVector = `
    MATCH (n:TransitPoint {subtype:$subtype})-->(vec:Vector)
    WITH n.key as dynamicKey, 
    { position:vec.position } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedVectors
    RETURN REDUCE(s={}, x IN collect(keyedVectors) | apoc.map.merge(s,x)) as subList
`;

const qTransitPath = `
    MATCH (n:TransitPath {subtype:$subtype})-->(path:Path)
    WITH n.key as dynamicKey, 
    { 
        index:path.index,
        count:path.count,
        next:path.next,
        position:path.position, 
        previous:path.previous,
        side:path.side,
        width:path.width,
        tubeind:path.tubeind,
        tubepos:path.tubepos,
        tubenorm:path.tubenorm
    } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedPaths
    RETURN REDUCE(s={}, x IN collect(keyedPaths) | apoc.map.merge(s,x)) as subList
`;

const qFootwayPath = `
    MATCH (n:Footway {subtype:$subtype})-->(path:Path)
    WITH n.key as dynamicKey, 
    { 
        index:path.index,
        count:path.count,
        next:path.next,
        position:path.position, 
        previous:path.previous,
        side:path.side,
        width:path.width,
        tubeind:path.tubeind,
        tubepos:path.tubepos,
        tubenorm:path.tubenorm
    } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedPaths
    RETURN REDUCE(s={}, x IN collect(keyedPaths) | apoc.map.merge(s,x)) as subList
`;

const qNaturalPath = `
    MATCH (n:NaturalPath {subtype:$subtype})-->(path:Path)
    WITH n.key as dynamicKey, 
    { 
        index:path.index,
        count:path.count,
        next:path.next,
        position:path.position, 
        previous:path.previous,
        side:path.side,
        width:path.width,
        tubeind:path.tubeind,
        tubepos:path.tubepos,
        tubenorm:path.tubenorm
    } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedPaths
    RETURN REDUCE(s={}, x IN collect(keyedPaths) | apoc.map.merge(s,x)) as subList
`;

const qStreetPath = `
    MATCH (n:Street {subtype:$subtype})-->(path:Path)
    WITH n.key as dynamicKey, 
    { 
        index:path.index,
        count:path.count,
        next:path.next,
        position:path.position, 
        previous:path.previous,
        side:path.side,
        width:path.width,
        tubeind:path.tubeind,
        tubepos:path.tubepos,
        tubenorm:path.tubenorm
    } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedPaths
    RETURN REDUCE(s={}, x IN collect(keyedPaths) | apoc.map.merge(s,x)) as subList
`;

const qHexagonShape = `
    MATCH (n:Hexagon {subtype:$subtype})-->(sh:Shape)
    WITH n.key as dynamicKey, 
    { index:sh.index, position:sh.position, normal:sh.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qParcelShape = `
    MATCH (n:Parcel {subtype:$subtype})-->(sh:Shape)
    WITH n.key as dynamicKey,
    { index:sh.index, position:sh.position, normal:sh.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qZoningShape = `
    MATCH (n:Zoning {subtype:$subtype})-->(sh:Shape)
    WITH n.key as dynamicKey,
    { index:sh.index, position:sh.position, normal:sh.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qLocaleShape = `
    MATCH (n:Locale {subtype:$subtype})-->(sh:Shape)
    WITH n.key as dynamicKey,
    { index:sh.index, position:sh.position, normal:sh.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qBlockShape = `
    MATCH (n:Neighborhood)-->(b:Block {subtype:$subtype})-->(sh:Shape)
    WITH b.key as dynamicKey,
    { index:sh.index, position:sh.position, normal:sh.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qBuildingMesh = `
    MATCH (n:Building {subtype:$subtype})-->(m:Mesh)
    WITH n.key as dynamicKey, 
    { position:m.position, normal:m.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qParkingMesh = `
    MATCH (n:Parking {subtype:$subtype})-->(m:Mesh)
    WITH n.key as dynamicKey, 
    { position:m.position, normal:m.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qCapacityMesh = `
    MATCH (n:Capacity {subtype:$subtype})-->(m:Mesh)
    WITH n.key as dynamicKey, 
    { position:m.position, normal:m.normal } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

const qGraphMorph = `
    MATCH (n:Graph {subtype:$subtype})-->(m:Morph)
    WITH n.key as dynamicKey, 
    { 
        position:m.position, 
        normal:m.normal, 
        resPos:m.resPos,
        offPos:m.offPos,
        exPos:m.exPos
    } as props
    WITH apoc.map.fromValues([dynamicKey, props]) as keyedShapes
    RETURN REDUCE(s={}, x IN collect(keyedShapes) | apoc.map.merge(s,x)) as subList
`;

/*
const qbLemma = `
    MATCH (bldg:Building)-->(m:Mesh) WHERE ($lemma IN bldg.lemma)
    RETURN m;
`;

const qbAddress = `
    MATCH (bldg:Building)-->(m:Mesh) WHERE bldg.address CONTAINS $address
    RETURN m;
`;

const qbName = `
    MATCH (bldg:Building)-->(m:Mesh) WHERE bldg.name CONTAINS $name
    RETURN m;
`;
*/

// removed -->(m:Mesh)
// actually Locale
const qbHex = `
    MATCH (n) WHERE n.key = $hex
    RETURN n;
`;

const qbLemma = `
    MATCH (bldg:Building) WHERE ($lemma IN bldg.lemma)
    RETURN bldg.key;
`;

const qbAddress = `
    MATCH (bldg:Building) WHERE bldg.address CONTAINS $address
    RETURN bldg.key;
`;

const qbName = `
    MATCH (bldg:Building) WHERE bldg.name CONTAINS $name
    RETURN bldg.key;
`;

module.exports = {
    qHexagonShape,
    qOSMPointVector,
    qTransitPointVector,
    qStreetPath,
    qTransitPath,
    qFootwayPath,
    qNaturalPath,
    qBuildingMesh,
    qLocaleShape,
    qParkingMesh,
    qBlockShape,
    qParcelShape,
    qZoningShape,
    qGraphMorph,
    qCapacityMesh,
    qbHex,
    qbLemma,
    qbAddress,
    qbName
}