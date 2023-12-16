import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    height: height
  },
  text: {
    color: '#333',
    marginTop: 10
  },
  heading: {
    color: '#333',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10
  },
  addressText: {
    fontSize: 14,
    letterSpacing: 1
  },
  middleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  middleText: {
    marginTop: 20,
    marginBottom: 20
  },
  customButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  disabledButton: {
    backgroundColor: '#bdc3c7' // Change the color for disabled state
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  marginText: {
    marginRight: 10
  },
  inputField: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    flex: 1,
    marginRight: 10
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  orText: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default styles;
