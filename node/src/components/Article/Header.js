import React from 'react'
import ReactDOM from 'react-dom'

export default class Header extends React.Component
{
    render() {
        return (<header className="header">
				<div className="row">
					<div className="col col-md-9">
						<div className="page-title">
							<h1>{this.props.title} {this.props.singular}</h1>
							<p dangerouslySetInnerHTML={{__html: this.props.description}}></p>
						</div>
					</div>
					<div className="col col-md-3">
						<div className="page-tagline">
							<p>
								<span dangerouslySetInnerHTML={{__html: this.props.date}}></span>
								{this.props.series.map((series) => {
                                    return (<a key={series.url} href={series.url}>{series.name}<br /></a>)
                                })}
                            </p>
						</div>
					</div>
				</div>
			</header>)
    }
}