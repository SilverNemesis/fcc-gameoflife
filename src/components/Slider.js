import React from 'react'
import PropTypes from 'prop-types'

class Slider extends React.Component {
    render() {
        return (
            <input className="slider" type="range" min={this.props.min} max={this.props.max} onChange={this.props.onChange} value={this.props.value} />
        )
    }
}

Slider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}

export default Slider