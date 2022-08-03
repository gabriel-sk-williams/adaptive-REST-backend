import React, { Component } from "react";

class SelectedContent extends Component {

	rp = (string) => {
		return string.replace(/^\w/, c => c.toUpperCase());
	}

	header = (layer) => {
		const [ label ] = layer;
		return label;
	}

	lotContent = (display) => {

		const pointContent = (display) => {
			let { layer, subtype } = display;
			const header = display ? this.header(layer) : null;
			const type = "Subtype: " + subtype.replace(/^\w/, c => c.toUpperCase());
			const name = display.name || null;
			const address = display["addr:postcode"] && display["addr:street"]
				? display["addr:postcode"] + " " + display["addr:street"]
				: null;
			const data = subtype === "amenity" ? display.amenity : null;

			return (
				<div>
					<h2>{name}</h2>
					<h2>{header}</h2>
					<h2 className="feather">{type}</h2>
					<h2 className="feather">{address}</h2>
					<h2 className="feather">{data}</h2>
				</div>
			);
		}

		const meshContent = (display) => {
			const header = this.header(display.layer) || null;
			const name = display.name !== "unknown" ? display.name : null;
			const location = display.address && Array.isArray(display.address)
				? display.address[0] // .join(", ") -> full address
				: display.address;
			const address = location && location !== "unknown" 
				? "Address: " + location
				: null;
	
			const lotArea = "Footprint: " + display["area_sf"] + " sf";

			const heightVal = Array.isArray(display.height) 
				? display.height.reduce((a,b) => Math.max(a,b))
				: display.height;

			const height = heightVal
				? "Height: " + Math.round(heightVal) + " ft." 
				: null;
			const coverage = display.layer === "building" 
				? "Coverage: " + display.coverage + "%" 
				: null;
			const pop = display["pop_total"] 
				? "Population: " + display["pop_total"] 
				: null;
	
			return (
				<div>
					<h2>{name}</h2>
					<h2>{header}</h2>
					<h2 className="feather">{address}</h2>
					<h2 className="feather">{lotArea}</h2>
					<h2 className="feather">{height}</h2>
					<h2 className="feather">{coverage}</h2>
					<h2 className="feather">{pop}</h2>
				</div>
			);
		}

		if (display) {
			return (
				display.layer.includes("OSMPoint") || display.layer.includes("TransitPoint")
				? pointContent(display)
				: meshContent(display)
			);
		}
	}

	blockContent = (display) => {
		if (display) {
			const header = this.header(display.layer) || null;
			const name = display.name === "unknown" ? display.subtype : display.name;
			const area = display["area_sf"] 
				? "Area: " + display["area_hectare"] + " hectares" 
				: null;
			const parcel = display["mun:landID"] 
				? "Municipal ID: " + display["mun:landID"]
				: null;
			const zoning = display.designation 
				? "Zoning: " + display.designation
				: display.subtype 
				? "Subtype: " + display.subtype
				: null;
			const density = display["density:total"] 
				? "Density: " + display["density:total"] + " persons / hectare"
				: null;

			return (
				<div>
					<h2>{name}</h2>
					<h2>{header}</h2>
					<h2 className="feather">{zoning}</h2>
					<h2 className="feather">{parcel}</h2>
					<h2 className="feather">{area}</h2>
					<h2 className="feather">{density}</h2>
				</div>
			);
		}else{
			return null;
		}
	}

	regionContent = (meta) => {
		const { "area_hectare":area, "pop_total":pop } = meta;
		const density = (pop/area).toFixed(0);
		const region = meta.city.replace(/^\w/, c => c.toUpperCase()) + ", Texas";
		const population = "Population: " + pop.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
		const regionArea = "Area: " + area + " hectares";
		const regionDensity = "Density: " + density + " persons / hectare";

		return (
			<div>
				<h2>{region}</h2>
				<h2 className="feather">{population}</h2>
				<h2 className="feather">{regionArea}</h2>
				<h2 className="feather">{regionDensity}</h2>
			</div>
		);
	}

	regionExpanded = (meta) => {
		const region = meta.city.replace(/^\w/, c => c.toUpperCase()) + ", Texas";
		const entries = Object.entries(meta).filter(obj => obj[0] !== "city");
		const list = entries.map((entry, id) => {
			const [ key, value ] = entry;
			const display = value.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
			return (
				<h2 key={id}>{key}: 
					<span className="feather">
						{" "}{display}
					</span>
				</h2>
			);
		})

		return (
			<div>
				<h4>{region}</h4>
				<h2>Region</h2>
				{list}
			</div>
		);
	}

	expandedContent = (node, meta) => {
		if (node) {
			const name = node.name === "unknown" ? node.subtype : node.name;
			const header = node.layer.reduce((acc, label) => acc += label, "");
			const entries = Object.entries(node).filter(obj => 
				!obj[0].includes("link") && 
				obj[0] !== "layer" && 
				obj[0] !== "scale" &&
				obj[0] !== "key" && 
				obj[0] !== "name"
			);

			const list = entries.map((entry, id) => {
				const [ key, value ] = entry;
				const display = Array.isArray(value) 
					? "[ " + value.join(", ") + " ]"
					: value;

				return (
					<h2 key={id}>{key}: 
						<span className="feather">
							{" "}{display}
						</span>
					</h2>
				);
			})

			return (
				<div>
					<h4>{name}</h4>
					<h2>{header}</h2>
					{list}
				</div>
			);
		
		}else{
			return this.regionExpanded(meta)
		}
	}

	render() {
		const { meta, hovered, selected, activeScale, expanded } = this.props;
		const display = selected || hovered;
		const textDisplay = expanded
			? this.expandedContent(display, meta)
			: activeScale === "Lot"
			? this.lotContent(display)
			: activeScale === "Block"
			? this.blockContent(display)
			: activeScale === "Region"
			? this.regionContent(meta)
			: null;

		return (
			<div className="selected-content">	
				{textDisplay}
			</div>
		);
	}
}

export default SelectedContent;

/*
this.header():
if (layer.includes("_")) {
	if (layer === "osm_point") return "OSM Point Datum";
	if (layer === "transit_point") return "Transit Point Datum";
	let substring = layer.substring(0, layer.indexOf("_"));
	return substring.replace(/^\w/, c => c.toUpperCase());
}
return layer.replace(/^\w/, c => c.toUpperCase());
*/