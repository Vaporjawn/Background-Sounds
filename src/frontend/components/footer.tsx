const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        borderTop: '1px solid black',
        color: '#666',
      }}
    >
      <p>© 2023 Background Sounds. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
