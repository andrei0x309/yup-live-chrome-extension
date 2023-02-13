


<div class="page-loader-wrapper">
    <div class="page-loader"></div>
</div>


<style lang="scss">

.page-loader-wrapper {
  position: fixed;
  top: 3rem;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  overflow: hidden;
}

.page-loader {
  display: block;
  position: relative;
  left: 50%;
  top: 40%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #16a085;
  animation: spin 1.7s linear infinite;
  z-index: 11;

}

.page-loader:before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #e74c3c;
    animation: spin-reverse .6s linear infinite;
  }
  
  .page-loader:after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #f9c922;
    animation: spin 1s linear infinite;
  }

</style>