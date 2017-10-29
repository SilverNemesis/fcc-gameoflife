import React from 'react'
import PropTypes from 'prop-types'

class ColorPicker extends React.Component {
    render() {
        return (
            <input className="color-picker" type="color" value={this.props.value} onChange={this.props.onChange} />
        )
    }
}

ColorPicker.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default ColorPicker