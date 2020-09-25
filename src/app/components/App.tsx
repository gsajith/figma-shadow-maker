import * as React from 'react';
import * as _ from 'underscore';
import ColorPicker from './ColorPicker';
import DirectionPicker from './DirectionPicker';
import Slider from './Slider';
import BezierChart from './BezierChart';
import '../styles/ui.css';
import Button from '@material-ui/core/Button';
import {withStyles, useTheme} from '@material-ui/core/styles';
import getBezierValue from '../util/bezier';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';

declare function require(path: string): any;

const styles = theme => ({
    main: {
        margin: 16,
    },
    buttonContainer: {
        margin: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    divider: {
        width: '100%',
        height: 1,
        background: theme.palette.divider,
    },
    valueContainer: {
        marginBottom: theme.spacing(2),
    },
    valueContainerHalf: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(2),
    },
    bezierWrapper: {
        position: 'relative',
    },
    bezierResultWrapper: {
        padding: 4,
        borderRadius: 4,
        border: '1px solid ' + theme.palette.primary.main + '32',
        position: 'absolute',
        height: 40,
        width: 216,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: -1,
    },
    bezierResultContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    advancedToggleLabel: {
        textTransform: 'uppercase',
        fontSize: '.75rem',
        letterSpacing: '0.08333em',
    },
    advancedToggleContainer: {
        marginLeft: 16,
        marginBottom: 16,
    },
    invertAlphaToggleContainer: {
        position: 'absolute',
        right: 0,
        marginTop: 2,
    },
});

const initialValues = {
    layers: 6,
    alpha: 0.07,
    offset: 100,
    blur: 80,
    gap: 0,
};

const initialBeziers = {
    alpha: [0.1, 0.6, 0.9, 0.4],
    offset: [0.7, 0, 0.9, 0.2],
    blur: [0.5, 0.1, 0.9, 0],
};

const App = ({classes}) => {
    const theme = useTheme();
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const [invertAlpha, setInvertAlpha] = React.useState(false);
    const [layers, setLayers] = React.useState(initialValues.layers);
    const [alpha, setAlpha] = React.useState(initialValues.alpha);
    const [offset, setOffset] = React.useState(initialValues.offset);
    const [gap, setGap] = React.useState(initialValues.gap);
    const [blur, setBlur] = React.useState(initialValues.blur);
    const [color, setColor] = React.useState('#000000');
    const [direction, setDirection] = React.useState(-90);

    const [alphaBezier, setAlphaBezier] = React.useState(initialBeziers.alpha);
    const [offsetBezier, setOffsetBezier] = React.useState(initialBeziers.offset);
    const [blurBezier, setBlurBezier] = React.useState(initialBeziers.blur);

    const throttledRenderPost = React.useRef(
        _.throttle((l, a, o, b, ab, ob, bb, c, d, g, ia) => {
            // Shadow props changed
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'rendered',
                        shadowProps: {
                            layers: l,
                            alpha: a,
                            offset: o,
                            blur: b,
                            alphaBezier: ab,
                            offsetBezier: ob,
                            blurBezier: bb,
                            color: c,
                            direction: d,
                            gap: g,
                            invertAlpha: ia,
                        },
                    },
                },
                '*'
            );
        }, 100)
    );

    React.useEffect(
        () =>
            throttledRenderPost.current(
                layers,
                alpha,
                offset,
                blur,
                alphaBezier,
                offsetBezier,
                blurBezier,
                color,
                direction,
                gap,
                invertAlpha
            ),
        [layers, alpha, offset, blur, alphaBezier, offsetBezier, blurBezier, color, direction, gap, invertAlpha]
    );

    const onCreate = React.useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'apply'}}, '*');
    }, []);

    const onCancel = React.useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    }, []);

    const handleAdvancedToggle = React.useCallback(() => {
        setShowAdvanced(!showAdvanced);
    }, [showAdvanced]);

    const handleInvertAlpha = React.useCallback(() => {
        setInvertAlpha(!invertAlpha);
    }, [invertAlpha]);

    React.useEffect(() => {
        parent.postMessage({pluginMessage: {type: 'advanced', show: showAdvanced}}, '*');
    }, [showAdvanced]);

    return (
        <>
            <div className={classes.main}>
                <div className={classes.valueContainerHalf}>
                    <ColorPicker color={color} setColor={setColor} />
                    <DirectionPicker direction={direction} setDirection={setDirection} />
                </div>
                <div className={classes.valueContainer}>
                    <Slider
                        minValue={1}
                        maxValue={8}
                        tooltip="Number of shadows to layer"
                        step={1}
                        defaultValue={initialValues.layers}
                        value={layers}
                        setValue={setLayers}
                        label={'Layers'}
                    />
                </div>
                <div className={classes.valueContainer}>
                    <div className={classes.invertAlphaToggleContainer}>
                        <Tooltip title="Flip the opacity curve" placement="left">
                            <FormControlLabel
                                classes={{
                                    label: classes.advancedToggleLabel,
                                }}
                                control={
                                    <Switch
                                        size="small"
                                        checked={invertAlpha}
                                        onChange={handleInvertAlpha}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Invert"
                            />
                        </Tooltip>
                    </div>
                    <Slider
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                        tooltip="Opacity of your shadow"
                        defaultValue={initialValues.alpha}
                        value={alpha}
                        setValue={setAlpha}
                        label={'Opacity'}
                    />
                    {showAdvanced && (
                        <div className={classes.bezierWrapper}>
                            <BezierChart bezierValue={alphaBezier} setBezierValue={setAlphaBezier} />
                            <div className={classes.bezierResultWrapper}>
                                <div className={classes.bezierResultContainer}>
                                    {[...Array(layers)].map((e, i) => {
                                        return (
                                            <div
                                                key={e}
                                                style={{
                                                    background: '#000000',
                                                    height: '100%',
                                                    opacity: invertAlpha
                                                        ? getBezierValue(alphaBezier, (1 / layers) * (layers - i))[1]
                                                        : getBezierValue(alphaBezier, (1 / layers) * (i + 1))[1],
                                                    flexGrow: 1,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={classes.valueContainer}>
                    <Slider
                        minValue={0}
                        maxValue={500}
                        step={1}
                        tooltip="Distance your shadow travels"
                        defaultValue={initialValues.offset}
                        value={offset}
                        setValue={setOffset}
                        label={'Distance'}
                    />
                    {showAdvanced && (
                        <div className={classes.bezierWrapper}>
                            <BezierChart bezierValue={offsetBezier} setBezierValue={setOffsetBezier} />
                            <div className={classes.bezierResultWrapper}>
                                <div className={classes.bezierResultContainer}>
                                    {[...Array(layers)].map((e, i) => {
                                        return (
                                            <div
                                                key={e}
                                                style={{
                                                    background: theme.palette.primary.main + '32',
                                                    height: '100%',
                                                    flexGrow: getBezierValue(offsetBezier, (1 / layers) * (i + 1))[1],
                                                    marginLeft: i == 0 ? 0 : 1,
                                                    marginRight: i == layers - 1 ? 0 : 1,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={classes.valueContainer}>
                    <Slider
                        minValue={0}
                        maxValue={500}
                        step={1}
                        tooltip="Blurriness of your shadow"
                        defaultValue={initialValues.blur}
                        value={blur}
                        setValue={setBlur}
                        label={'Blur'}
                    />
                    {showAdvanced && (
                        <div className={classes.bezierWrapper}>
                            <BezierChart bezierValue={blurBezier} setBezierValue={setBlurBezier} />
                            <div className={classes.bezierResultWrapper}>
                                <div className={classes.bezierResultContainer}>
                                    {[...Array(layers)].map((e, i) => {
                                        return (
                                            <div
                                                key={e}
                                                style={{
                                                    background: theme.palette.primary.main + '32',
                                                    height:
                                                        Math.min(
                                                            getBezierValue(blurBezier, (1 / layers) * (i + 1))[1],
                                                            1.2
                                                        ) *
                                                            100 +
                                                        '%',
                                                    marginLeft: i == 0 ? 0 : 1,
                                                    marginRight: i == layers - 1 ? 0 : 1,
                                                    flexGrow: 1,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showAdvanced && (
                    <div className={classes.valueContainer}>
                        <Slider
                            minValue={0}
                            maxValue={500}
                            tooltip="Minimum distance to your shadow"
                            step={1}
                            defaultValue={initialValues.gap}
                            value={gap}
                            setValue={setGap}
                            label={'Gap'}
                        />
                    </div>
                )}
            </div>
            <div className={classes.advancedToggleContainer}>
                <FormControlLabel
                    classes={{
                        label: classes.advancedToggleLabel,
                    }}
                    control={
                        <Switch
                            size="small"
                            checked={showAdvanced}
                            onChange={handleAdvancedToggle}
                            name="checked"
                            color="primary"
                        />
                    }
                    label="Advanced view"
                />
            </div>
            <div className={classes.divider} />
            <div className={classes.buttonContainer}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={onCreate}>
                    Apply
                </Button>
            </div>
        </>
    );
};

export default withStyles(styles)(App);
