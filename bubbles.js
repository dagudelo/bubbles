

                    
var width =900,
height = 600;
var radiusScale =d3.scaleSqrt().domain([1,500]).range([10,80])

var svg = d3.select("#chart")
                    .append("svg")
                    .attr("height",height)
                    .attr("width", width)
                    .append("g")
                    .attr("transform","translate(0,0)")
var defs = svg.append("defs");
defs.append("pattern")
    .attr("id","john-snow")
    .attr("width","100%")
    .attr("height","100%")
    .attr("patternContentUnits","objectBoundingBox")  
    .append("image")
    .attr("height",1)
    .attr("width",1)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
    .attr("xlink:href","john-snow.png") 
var forceSeparate = d3.forceX(function(d){
    if (d.decade==='pre-2000'){
        console.log(d.id)
        return 250
    } else {
        console.log(d.id)
        return 650
    }}).strength(0.05)

var forceCombine = d3.forceX(width/2).strength(0.05)

var simulation = d3.forceSimulation()
                   .force("x", forceCombine)
                   .force("y", d3.forceY(height/2).strength(0.05))
                   .force("collide", d3.forceCollide(function(d){
                    return radiusScale(d.sales)
                }))
 var tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '0 10px')
      .style('background', 'white')
      .style('opacity', 0);       
   d3.queue()
     .defer(d3.csv, "sales.csv")
     .await(ready)
d3.select("#byDecade")
    .on("click",function(d){
        simulation
        .force("x", forceSeparate)
        .alphaTarget(0.5)
        .restart()
    })
    d3.select("#group")
    .on("click",function(d){
        simulation
        .force("x", forceCombine)
        .alphaTarget(0.5)
        .restart()
    })


function ready(error, datapoints){
    defs.selectAll(".artist-img")
        .data(datapoints)
        .enter().append("pattern")
        .attr("class", "artists-img")
        .attr("id", function(d){
            return d.name
        })
        .attr("width","100%")
        .attr("height","100%")
        .attr("patternContentUnits","objectBoundingBox")  
        .append("image")
        .attr("height",1)
        .attr("width",1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
        .attr("xlink:href",function (d){
            return "./images/"+d.image_path
        })
        var circles =svg.selectAll(".artist")
                    .data(datapoints)
                    .enter().append("circle")
                    .attr("class", ".artists")
                    .attr("r", function(d){
                        return radiusScale(d.sales)
                    })
                    .attr("fill",function(d){
                        return "url(#"+d.name+")"
                    })
                    .on('mouseover', function(d) {
                        tooltip.transition().duration(200)
                          .style('opacity', .9)
                        tooltip.html(
                          '<div style="font-size: 2rem; font-weight: bold">' +
                            d.decade+'</div>'
                        )
                          .style('left', (d3.event.pageX -35) + 'px')
                          .style('top', (d3.event.pageY -30) + 'px')
                        tempColor = this.style.fill;
                        //d3.select(this)
                          //.style('fill', 'yellow')
                      })
    

        
                    
    simulation.nodes(datapoints)
    .on("tick",ticked)

function ticked (){
    circles
    .attr("cx", function(d){
        return  d.x
    })
    .attr("cy", function(d){
        return d.y
    })
}
}

      