import React, { useEffect } from 'react';
import * as d3 from 'd3';
import SSF from "ssf"
// import { configs } from 'eslint-plugin-prettier';

const RadialGauge = (props) => {
	useEffect(() => {
		drawRadial(props)
	}, [props])
	return <div className='viz' />
}

function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
  	return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
}

function wrap(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.4, // ems
		y = text.attr("y"),
		x = text.attr("x"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}

function getLabel(rule, value, label, override) {
	// console.log(rule, value, label, override)
	label = override === "" ? label : override;
	if (rule === "value") {
		return `${value}`;
	} else if (rule === "label") {
		return `${label}`;
	} else if (rule === "both") {
		return `${value} ${label}`;
	} else if (rule === "none" ) {
		return ``;
	}
}

const drawRadial = (props) => {
	let limiting_aspect = "vw";
	let radius = 20;
	let cutoutCalc = radius*(0.25);
	let valueLabelCalc = radius*(1.2);
	let armLength = radius*(1.2);
	let gaugeAngle = 90 * Math.PI * 2 / 360;
  let spinnerLength = radius * (1.2);
  
  console.log(props)

	if (props.target === undefined) {
		let max = props.range != undefined ? props.range[1] : Math.round(Math.max(value) * 1.3)
	} else {
		let max = props.range != undefined ? props.range[1] : Math.round(Math.max(value, target) * 1.3)
	}
	
	// Ditch whatever is in our viz window
	if (props.trellis_by === "none") {
		d3.selectAll(`.viz > *`).remove();
		d3.selectAll(`.${ props.cleanup }`).remove();
		d3.selectAll(`[class^='subgauge']`).remove();
		// console.log(d3.selectAll(`class^='subgauge'`))
	} else {
		// d3.select(`.viz > *`).remove();
		d3.selectAll(`.gauge`).remove();
		d3.selectAll(`.${ props.cleanup }`).remove();
		// console.log(props.trellis_limit, d3.selectAll(`[class^='subgauge']`).size())
		var overfill = d3.range(props.trellis_limit, d3.selectAll(`[class^='subgauge']`).size()+1)
		overfill.forEach(function(d) {
			d3.selectAll(`.subgauge${d}`).remove();
		})
	}
	// div that houses the svg
	var div = d3.select('.viz')
	  	.style('overflow-x', 'hidden')
	  	.style('overflow-y', 'hidden')
	  	.style('position', 'fixed')
	  	.attr('height', '100%');
	// append a fresh svg
	const svg = d3.select('.viz').append('svg');
	svg.attr('width', props.w)
		.attr('height', props.h)
		.attr('id', 'svg-viz')
		.attr('class', props.cleanup)
		.attr('preserveAspectRatio', 'xMidYMid meet')
	  	.attr('viewBox', `${props.w/-2} ${props.h/-2} ${props.w} ${props.h}`);
	let g = svg.append('g').attr('id', 'g-viz');
	// create the gauge background
	var generator = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(-gaugeAngle)
      	.endAngle(gaugeAngle);
  	var cover = g.append('path')
  		.attr('class', 'gauge_background')
  		.attr('d', generator)
  		.attr('fill', props.gauge_background)
  		.attr('stroke', 'none');

  	// find how much of the gauge is filled
  	// then fill the gauge
  	var proportion = mapBetween(props.value,0,1,props.range[0],props.range[1])
  	var value_standard = props.angle*2*proportion - props.angle;
  	var valueAngle = value_standard * Math.PI * 2 / 360;
  	var upBinary = props.angle < 90 ? -1 : 1;
  	if (props.gauge_fill_type === "progress") {
  		var fill_generator = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(-gaugeAngle)
      	.endAngle(valueAngle);
  		var gauge_fill = g.append('path')
  		.attr('class', 'gaugeFill')
  		.attr('d', fill_generator)
  		.attr('fill', props.color)
  		.attr('stroke', `${props.color}`)
  		.attr('stroke-width', '1px');
  	} else if (props.gauge_fill_type === "segment") {
  		let len = props.fill_colors.length
  		props.fill_colors.map((d, i) => {
  			var Jpro = i / len;
		  	var Jstan = props.angle*2*Jpro - props.angle;
		  	var JiAngle = Jstan * Math.PI * 2 / 360;
  			var Kpro = (i+1) / len;
		  	var Kstan = props.angle*2*Kpro - props.angle;
		  	var KiAngle = Kstan * Math.PI * 2 / 360;
		  	var fill_generator = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(JiAngle)
	      	.endAngle(KiAngle);
	  		var gauge_fill = g.append('path')
	  		.attr('class', `gaugeFill-${i}`)
	  		.attr('d', fill_generator)
	  		.attr('fill', props.fill_colors[i])
	  		.attr('stroke', `${props.fill_colors[i]}`)
	  		.attr('stroke-width', '1px');
  		})
  	} else if (props.gauge_fill_type === "progress-gradient") {
  		let divisor = 1 / props.fill_colors.length
  		let which = Math.floor(proportion / divisor);
  		which = proportion >= 1 ? props.fill_colors.length-1 : which;
  		var fill_generator = d3.arc()
      	.innerRadius(cutoutCalc)
      	.outerRadius(radius)
      	.startAngle(-gaugeAngle)
      	.endAngle(valueAngle);
  		var gauge_fill = g.append('path')
  		.attr('class', 'gaugeFill')
  		.attr('d', fill_generator)
  		.attr('fill', props.fill_colors[which])
  		.attr('stroke', `${props.fill_colors[which]}`)
  		.attr('stroke-width', '1px');
    }
    console.log({cutoutCalc,armLength,gaugeAngle,valueAngle})
  	// creates a left arm border
  	var leftArmArc = d3.arc()
	    .innerRadius(cutoutCalc*0.97)
	    .outerRadius(armLength)
	    .startAngle(-gaugeAngle)
	    .endAngle(-gaugeAngle);
  	var leftArmSel = g.append('path')
  		.attr('class', 'leftArmArc')
  		.attr('d', leftArmArc)
  		.attr('fill', props.gauge_background)
  		.attr('stroke', props.gauge_background)
      .attr('stroke-width', props.arm_weight/5);
    console.log(leftArmSel)
  	g.append('text')
  		.attr('class', 'minLabel')
  		.text(`${props.range_formatting === undefined || props.range_formatting === "" ? props.range[0] : SSF.format(props.range_formatting, props.range[0])}`)
  		.style('font-size', `${props.label_font}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('fill', props.range_color)
  		.style('font-weight', "bold")
  		.attr('dx', `-${props.range_x}em`)
  		.attr('dy', `${-1*props.range_y}em`)
  		.attr('transform', `translate(${leftArmSel.node().getBBox().x} ${0 + upBinary*leftArmSel.node().getBBox().height - (props.angle > 90 ? 90 - props.angle : 0)})`);
  	// creates a right arm border
  	var rightArmArc = d3.arc()
        .innerRadius(cutoutCalc*0.97)
      	.outerRadius(armLength)
      	.startAngle(gaugeAngle)
      	.endAngle(gaugeAngle);
  	var rightArmSel = g.append('path')
  		.attr('class', 'rightArmArc')
  		.attr('d', rightArmArc)
  		.attr('fill', props.gauge_background)
  		.attr('stroke', props.gauge_background)
  		.attr('stroke-width', props.arm_weight/5);
  	g.append('text')
  		.attr('class', 'maxLabel')
  		.text(`${props.range_formatting === undefined || props.range_formatting === "" ? props.range[1] : SSF.format(props.range_formatting, props.range[1])}`)
  		.style('font-size', `${props.label_font}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('fill', props.range_color)
  		.style('font-weight', "bold")
  		.attr('dx', `${props.range_x-1}em`)
  		.attr('dy', `${-1*props.range_y}em`)
  		.attr('transform', `translate(${rightArmSel.node().getBBox().x + rightArmSel.node().getBBox().width} ${0 + upBinary*rightArmSel.node().getBBox().height - (props.angle > 90 ? 90 - props.angle : 0)})`);
		
		// create the spinner and point to the value
		function getSpinnerArm(spinnerType) {
			if (spinnerType === "spinner") {
				return d3.arc()
				.innerRadius(0)
				.outerRadius(spinnerLength)
				.startAngle(valueAngle)
				.endAngle(valueAngle)
			} else if (spinnerType === "needle") {
				var _in = valueAngle - (Math.PI/2),
					_im = _in - (55*Math.PI/60),
					_ip = _in + (55*Math.PI/60);

				var topX = spinnerLength * Math.cos(_in),
					topY = spinnerLength * Math.sin(_in);

				var leftX = (spinnerLength*0.1) * Math.cos(_im),
					leftY = (spinnerLength*0.1) * Math.sin(_im);

				var rightX = (spinnerLength*0.1) * Math.cos(_ip),
					rightY = (spinnerLength*0.1) * Math.sin(_ip);

				return d3.line()([[topX, topY], [leftX, leftY], [rightX, rightY]]) + 'Z';
			} else if (spinnerType === "auto") {
				var _in = valueAngle - (Math.PI/2),
					_im = _in - (55*Math.PI/60),
					_ip = _in + (55*Math.PI/60);

				var topX = spinnerLength * Math.cos(_in),
					topY = spinnerLength * Math.sin(_in);

				var leftX = (spinnerLength*0.15) * Math.cos(_im),
					leftY = (spinnerLength*0.15) * Math.sin(_im);

				var rightX = (spinnerLength*0.15) * Math.cos(_ip),
					rightY = (spinnerLength*0.15) * Math.sin(_ip);

				return d3.line()([[topX, topY], [leftX, leftY], [rightX, rightY]]) + 'Z';
			} else if (spinnerType === "inner") {
				return d3.arc()
				.innerRadius(cutoutCalc)
				.outerRadius(spinnerLength)
				.startAngle(valueAngle)
				.endAngle(valueAngle)
			} 
		}
		var spinnerArm = getSpinnerArm(props.spinner_type);

		var spinnerArmSel = g.append('path')
			.attr('class', 'spinnerArm')
			.attr('d', spinnerArm)
			.attr('fill', props.spinner_background)
			.attr('stroke', props.spinner_background)
			.attr('stroke-width', props.spinner_weight/10);

		function getSpinnerCore(spinnerType) {
			if (spinnerType === "spinner") {
				return  g.append('circle')
				.attr('class', 'spinnerCenter')
				.attr('r', props.spinner_weight/10)
				.style('fill', props.spinner_background);
			} else if (spinnerType === "needle" || spinnerType === "inner") {
				return  null
			} else if (spinnerType === "auto") {
				return  g.append('circle')
				.attr('class', 'spinnerCenter')
				.attr('r', props.spinner_weight/2)
				.style('stroke', props.gauge_background)
				.style('stroke-weight', '2px')
				.style('fill', "#FFF");
			}
		}
		var spinnerCore = getSpinnerCore(props.spinner_type);

		spinnerArmSel.on("click", function(d,i) {
			LookerCharts.Utils.openDrillMenu({
				links: props.value_links,
				event: event
			});
		})
	// find what percent of the gauge is equivalent to the target value
	if (props.target_source !== "off") {

	if (props.target_label_type === "both") {
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	  	// label the target spinner value
	  	var targetLabelArc = d3.arc()
	      	.innerRadius(radius*props.target_label_padding)
	      	.outerRadius(radius*props.target_label_padding)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLabelLine = g.append('path')
	  		.attr('class', 'targetLabel')
	  		.attr('d', targetLabelArc);
	  	var targetValueLine = g.append('text')
	  		.attr('class', 'targetValue')
	  		.text(`${props.target_rendered} ${props.target_label}`)
	  		.style('font-size', `${props.target_label_font}${limiting_aspect}`)
	  		.style('font-family', 'Arial, Helvetica, sans-serif')
	  		.attr('dy', '.35em');
		targetValueLine.attr('x', ()=>{
	  			if (tarNeg > 0) {
	  				return targetLabelLine.node().getBBox().x;
	  			} else {
	  				return targetLabelLine.node().getBBox().x - targetValueLine.node().getBBox().width
	  			}
	  		})
	  		.attr('y', () => {
	  			return targetLabelLine.node().getBBox().y
	  		});
	} else if (props.target_label_type === "dboth") {
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	  	// label the target spinner value
	  	var targetLabelArc = d3.arc()
	      	.innerRadius(radius*props.target_label_padding)
	      	.outerRadius(radius*props.target_label_padding)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLabelLine = g.append('path')
	  		.attr('class', 'targetLabel')
	  		.attr('d', targetLabelArc);
	  	var targetValueLine = g.append('text')
	  		.attr('class', 'targetValue')
	  		.text(`${props.target_rendered} ${props.target_dimension}`)
	  		.style('font-size', `${props.target_label_font}${limiting_aspect}`)
	  		.style('font-family', 'Arial, Helvetica, sans-serif')
	  		.attr('dy', '.35em');
		targetValueLine.attr('x', ()=>{
	  			if (tarNeg > 0) {
	  				return targetLabelLine.node().getBBox().x;
	  			} else {
	  				return targetLabelLine.node().getBBox().x - targetValueLine.node().getBBox().width
	  			}
	  		})
	  		.attr('y', () => {
	  			return targetLabelLine.node().getBBox().y
	  		});
	} else if (props.target_label_type === "dim") {
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	  	// label the target spinner value
	  	var targetLabelArc = d3.arc()
	      	.innerRadius(radius*props.target_label_padding)
	      	.outerRadius(radius*props.target_label_padding)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLabelLine = g.append('path')
	  		.attr('class', 'targetLabel')
	  		.attr('d', targetLabelArc);
	  	var targetValueText = g.append('text')
	  		.attr('class', 'targetValue')
	  		.text(`${props.target_dimension}`)
	  		.style('font-size', `${props.target_label_font}${limiting_aspect}`)
	  		.style('font-family', 'Arial, Helvetica, sans-serif')
	  		.attr('dy', '.35em');
		targetValueText.attr('x', ()=>{
	  			if (tarNeg > 0) {
	  				return targetLabelLine.node().getBBox().x;
	  			} else {
	  				return targetLabelLine.node().getBBox().x - targetValueText.node().getBBox().width
	  			}
	  		})
	  		.attr('y', () => {
	  			return targetLabelLine.node().getBBox().y
	  		});
	} else if (props.target_label_type === "value"){
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	  	// label the target spinner value
	  	var targetLabelArc = d3.arc()
	      	.innerRadius(radius*props.target_label_padding)
	      	.outerRadius(radius*props.target_label_padding)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLabelLine = g.append('path')
	  		.attr('class', 'targetLabel')
	  		.attr('d', targetLabelArc);
		var targetValueText = g.append('text')
	  		.attr('class', 'targetValue')
	  		.text(`${props.target_rendered}`)
	  		.style('font-size', `${props.target_label_font}${limiting_aspect}`)
	  		.style('font-family', 'Arial, Helvetica, sans-serif')
	  		.attr('dy', '.35em');
	  	targetValueText.attr('x', ()=>{
	  			if (tarNeg > 0) {
	  				return targetLabelLine.node().getBBox().x;
	  			} else {
	  				return targetLabelLine.node().getBBox().x - targetValueText.node().getBBox().width
	  			}
	  		})
	  		.attr('y', () => {
	  			return targetLabelLine.node().getBBox().y
	  		});
	} else if (props.target_label_type === "label"){
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	  	// label the target spinner value
	  	var targetLabelArc = d3.arc()
	      	.innerRadius(radius*props.target_label_padding)
	      	.outerRadius(radius*props.target_label_padding)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLabelLine = g.append('path')
	  		.attr('class', 'targetLabel')
			  .attr('d', targetLabelArc);
		var targetValueText = g.append('text')
	  		.attr('class', 'targetValue')
	  		.text(`${props.target_label}`)
	  		.style('font-size', `${props.target_label_font}${limiting_aspect}`)
	  		.style('font-family', 'Arial, Helvetica, sans-serif')
	  		.attr('dy', '.35em');
			targetValueText.attr('x', ()=>{
	  			if (tarNeg > 0) {
	  				return targetLabelLine.node().getBBox().x;
	  			} else {
	  				return targetLabelLine.node().getBBox().x - targetValueText.node().getBBox().width
	  			}
	  		})
	  		.attr('y', () => {
	  			return targetLabelLine.node().getBBox().y
	  		});
	  		// .call(wrap, props.wrap_width);
	} else if (props.target_label_type === "nolabel"){
		var target_proportion = mapBetween(props.target,0,1,props.range[0],props.range[1])
	  	var tarNeg = target_proportion < .5 ? -1 : 1;
	  	var target_standard = props.angle*2*target_proportion - props.angle;
	  	var targetAngle = target_standard * Math.PI * 2 / 360;
	  	var targetSpinner = d3.arc()
	      	.innerRadius(cutoutCalc)
	      	.outerRadius(radius)
	      	.startAngle(targetAngle)
	     	.endAngle(targetAngle);
	  	var targetLine = g.append('path')
	  		.attr('class', 'targetSpinner')
	  		.attr('d', targetSpinner)
	  		.attr('stroke', props.target_background)
	  		.attr('stroke-width', props.target_weight/10)
	  		.attr('stroke-dasharray', `${props.target_length} ${props.target_gap}`);
	}
	}
	// console.log(props.value_label)
	// getLabel(props.value_label_type, props.value.rendered, props.value_label, props.value_label_override)
	// label the value
	var drillTop = null;
	var drillBottom = null;
  	if (props.value_label_type === "value") {
		var valueText = g.append('text')
  		.attr('class', 'gaugeValue')
  		.text(`${props.value_rendered}`)
  		.style('font-size', `${props.value_label_font}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
		.style('color', '#282828');
		valueText.attr('transform', `translate(${0 - valueText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillTop = valueText;
  	} else if (props.value_label_type === "label") {
		var labelText = g.append('text')
  		.attr('class', 'gaugeValueLabel')
  		.text(`${props.value_label}`)
  		.style('font-size', `${props.value_label_font*.55}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#707070')
  		.attr('dy', '1em');
		labelText.attr('transform', `translate(${0 - labelText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillTop = labelText;
  	} else if (props.value_label_type === "both") {
		var valueText = g.append('text')
  		.attr('class', 'gaugeValue')
  		.text(`${props.value_rendered}`)
  		.style('font-size', `${props.value_label_font}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#282828');
		valueText.attr('transform', `translate(${0 - valueText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillTop = valueText;
		var labelText = g.append('text')
  		.attr('class', 'gaugeValueLabel')
  		.text(`${props.value_label}`)
  		.style('font-size', `${props.value_label_font*.55}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#707070')
  		.attr('dy', '1.2em');
		labelText.attr('transform', `translate(${0 - labelText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillBottom = labelText;
  	} else if (props.value_label_type === "dim") {
		var dimText = g.append('text')
  		.attr('class', 'gaugeValueLabel')
  		.text(`${props.value_dimension}`)
  		.style('font-size', `${props.value_label_font*.55}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#707070')
		.attr('dy', '1em');
		dimText.attr('transform', `translate(${0 - dimText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillTop = dimText;
  	} else if (props.value_label_type === "dboth") {
		var valueText = g.append('text')
  		.attr('class', 'gaugeValue')
  		.text(`${props.value_rendered}`)
  		.style('font-size', `${props.value_label_font}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#282828');
		valueText.attr('transform', `translate(${0 - valueText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillTop = valueText;
		var dimText = g.append('text')
  		.attr('class', 'gaugeValueLabel')
  		.text(`${props.value_dimension}`)
  		.style('font-size', `${props.value_label_font*.55}${limiting_aspect}`)
  		.style('font-family', 'Arial, Helvetica, sans-serif')
  		.style('color', '#707070')
  		.attr('dy', '1.2em');
		dimText.attr('transform', `translate(${0 - dimText.node().getBBox().width/2} ${0 + valueLabelCalc})`);
		drillBottom = dimText;
  	}
  	drillTop === null ? null : drillTop.on("click", function(d,i) {
		LookerCharts.Utils.openDrillMenu({
			links: props.value_links,
			event: event
		});
	})
	drillBottom === null ? null : drillBottom.on("click", function(d,i) {
		LookerCharts.Utils.openDrillMenu({
			links: props.value_links,
			event: event
		});
	})
  	let wSca = props.w*.85 / g.node().getBBox().width;
  	let hSca = props.h*.85 / g.node().getBBox().height;
	  // console.log(wSca, hSca)
	// g.attr('transform', `scale(${Math.min(wSca, hSca)})translate(0 ${(props.h - g.node().getBBox().height)/4})`);
	if (props.trellis_by === "none") {
		g.attr('transform', `scale(${Math.min(wSca, hSca)})translate(0 ${(props.h - g.node().getBBox().height)/4})`);
	} else {
		g.attr('transform', `scale(1.2)translate(0 ${(props.h - g.node().getBBox().height)/4})`);
	}
  	 // .attr('preserveAspectRatio', 'xMidYMid meet');
}

export default RadialGauge
