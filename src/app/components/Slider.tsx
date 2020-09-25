import * as React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/core/styles';

const ColoredSlider = withStyles(theme => ({
    rail: {
        color: theme.palette.action.disabled,
    },
    track: {
        color: theme.palette.primary.main,
    },
    root: {
        zIndex: 2,
    },
}))(Slider);

const MySlider = ({defaultValue = 0, minValue, maxValue, step, label, value, setValue, tooltip}) => {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div>
                <Tooltip title={tooltip} placement="right">
                    <Typography variant="overline" id={label + '-slider'} gutterBottom>
                        {label}
                    </Typography>
                </Tooltip>
                <ColoredSlider
                    defaultValue={defaultValue}
                    getAriaValueText={val => `${val}`}
                    value={value}
                    onChange={handleChange}
                    aria-labelledby={label + '-slider'}
                    step={step}
                    min={minValue}
                    max={maxValue}
                    valueLabelDisplay="auto"
                />
            </div>
        </>
    );
};

export default MySlider;
