const App = () => {
  const [dopingData, setDopingData] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
      const data = await response.json();
      setDopingData(data);
    }
    fetchData();
  }, []);
  return (
    <div>
      <RenderGraph data={dopingData} width={1200} height={600} />
    </div>
  )
  
}

const RenderGraph = ({ data, width, height }) => {
  React.useEffect(() => {
    createGraph();
  }, [data]);

  const createGraph = () => {
    const margin = { top: 20, right: 70, bottom: 20, left: 70 };
    
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.Seconds * 1000)))
      .range([margin.top, height - margin.bottom]);
    
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    let tooltip = d3.select('#container')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)
    
    d3.select('svg')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .classed('dot', true)
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 8)
      .attr('stroke', 'black')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .attr('fill', d => d.Doping ? 'red' : 'green')
      .on('mouseover', (d, i) => {
        tooltip.style('opacity', .9)
          .attr('data-year', d.Year)
          .attr('data-date', d.Seconds)
          .style('left', (d3.event.pageX - document.getElementById('container').offsetLeft + 20) + 'px')
          .style('top', (d3.event.pageY - document.getElementById('container').offsetTop + 20) + 'px')
          .html(d.Name + ': ' + d.Nationality + '<br>' + 'Year:' + d.Year + ' Time:'+ d.Time + '<br>' + '<br>' + d.Doping + '<br>')
      })

    d3.select('svg')
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
    
    d3.select('svg')
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    d3.select('svg')
      .append('text')
      .attr('id', 'y-axis-label')
      .attr('x', -height + 20)
      .attr('y', width / 90)
      .attr('transform', 'rotate(-90)') 
      .text('Time in Minutes');

    d3.select('svg')
      .append('rect')
      .attr('id', 'legend')
      .attr('x', width - 240)
      .attr('y', height - 435)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'green')

    d3.select('svg')
      .append('text')
      .attr('id', 'legend-text')
      .attr('x', width - 200)
      .attr('y', height - 420)
      .text('No doping allegations');
    
      d3.select('svg')
      .append('rect')
      .attr('id', 'legend')
      .attr('x', width - 240)
      .attr('y', height - 410)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'red')

    d3.select('svg')
      .append('text')
      .attr('id', 'legend-text')
      .attr('x', width - 200)
      .attr('y', height - 395)
      .text('Doping allegations');

  }

  return (
    <div id="container">
      <h2 id="title">DOPING IN PROFESSIONAL BYCICLE RACING</h2>
      <svg width={width} height={height}/>
    </div>
  )
}
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
  