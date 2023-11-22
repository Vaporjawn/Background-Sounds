import viteLogo from '/vite.svg';
import reactLogo from '../../assets/react.svg';
import Footer from '../components/footer';
import Header from '../components/header';
import Timer from '../components/timer/timer';

const HomePage = () => {
  return (
    <>
      <div>
        <Header />
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
        <Timer />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
