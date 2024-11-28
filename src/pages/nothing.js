import Default from "../templates/default"
import img from "../assets/underConstruction.jpg"
import styles from "../styles/nothing.module.css"

const Nothing = () => {
    return (
        <Default>
            <img src={img} alt="Under Construction" className={styles.img}/>
        </Default>
    );
}

export default Nothing