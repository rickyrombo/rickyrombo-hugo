import React from 'react'
import ReactDOM from 'react-dom'

export default class Header extends React.Component
{
    render() {
        return (<header className="header">
				<div className="row">
					<div className="col col-md-6">
						<div className="page-title">
							<h1>{this.props.title} {this.props.singular}</h1>
						</div>
					</div>
					<div className="col col-md-6">
						<div className="page-tagline">
							<p>
                                <span dangerouslySetInnerHTML={{__html: this.props.description}}></span>
								{this.props.series.map((series) => {
                                    return (<a key={series.url} href={series.url}><br />{series.name}</a>)
                                })}
                            </p>
						</div>
					</div>
				</div>
			</header>)
    }
}