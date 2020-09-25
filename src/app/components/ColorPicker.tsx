import * as React from 'react';
import {ChromePicker} from 'react-color';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const ColorPicker = ({color, setColor}) => {
    const [pickerShown, setPickerShown] = React.useState(false);

    const handleClick = () => {
        setPickerShown(!pickerShown);
    };

    const handleClose = () => {
        setPickerShown(false);
    };

    const handleSetColor = color => {
        setColor(color.hex);
    };

    return (
        <>
            <div style={{marginRight: 24}}>
                <Tooltip title="Hex value of your shadow" placement="right">
                    <Typography variant="overline" id="color-picker" gutterBottom>
                        Color
                    </Typography>
                </Tooltip>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button
                        style={{
                            width: 25,
                            height: 25,
                            background: color,
                            borderRadius: 4,
                            display: 'inline-block',
                            cursor: 'pointer',
                        }}
                        onClick={handleClick}
                    />
                    <div style={{display: 'inline-block', marginLeft: 8, fontSize: '14px', opacity: 0.5}}>{color}</div>
                </div>
                {pickerShown ? (
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: 4,
                        }}
                    >
                        <div
                            style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px',
                            }}
                            onClick={handleClose}
                        />
                        <ChromePicker
                            disableAlpha={true}
                            aria-labelledby="color-picker"
                            color={color}
                            onChange={handleSetColor}
                        />
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default ColorPicker;
