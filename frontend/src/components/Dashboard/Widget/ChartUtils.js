
import $ from 'jquery';

export function renderChart(chartNode, html) {
	let divRe = /\<div(.*)\<\/div\>/i;
	let scriptRe = /\<script(.*)\<\/script\>/i;
	let div = html.match(divRe)[0];
	let script = html.match(scriptRe)[0];
	//script = script.replace(/\\"/g,'\\\\"');
	let jqueryNode = $(chartNode);
	 //console.log('test debug',chartNode,jqueryNode);
	// console.log('debug html ****:[div]',div,'[script]',script);
	jqueryNode.empty();
	jqueryNode.append(div);
	jqueryNode.append(script);
}

