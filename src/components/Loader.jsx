import classes from './Loader.module.css'
export default function Loader() {
    return (
        <div className='h-screen flex justify-center items-center'>
        <div className={classes.loadingspinner}>
            <div id={classes.square1}></div>
            <div id={classes.square2}></div>
            <div id={classes.square3}></div>
            <div id={classes.square4}></div>
            <div id={classes.square5}></div>
        </div>
        </div>
    )
}
