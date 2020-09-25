import * as React from 'react';
import {withStyles, useTheme} from '@material-ui/core/styles';
import {BezierCurveEditor} from 'react-bezier-curve-editor';

const styles = theme => ({
    bezier: {
        marginTop: -1 * theme.spacing(3),
        marginBottom: -1 * theme.spacing(4),
        zIndex: 1,
    },
});

type BezierProps = {
    classes: any;
    bezierValue: any;
    setBezierValue: any;
};

const BezierChart = ({classes, bezierValue, setBezierValue}: BezierProps) => {
    const theme = useTheme();

    const handleBezierValueChange = value => {
        setBezierValue(value);
    };

    return (
        <BezierCurveEditor
            className={classes.bezier}
            curveLineColor={theme.palette.primary.main}
            handleLineColor={theme.palette.action.disabled}
            startHandleColor={theme.palette.text.primary}
            endHandleColor={theme.palette.text.primary}
            width={220}
            height={40}
            outerAreaSize={48}
            outerAreaColor={'#FFFFFF'}
            fixedHandleColor={theme.palette.primary.main}
            value={bezierValue}
            onChange={handleBezierValueChange}
        />
    );
};

export default withStyles(styles)(BezierChart);
