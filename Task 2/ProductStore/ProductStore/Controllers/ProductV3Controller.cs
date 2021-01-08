using ProductStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;


namespace ProductStore.Controllers
{
    public class ProductV3Controller : ApiController
    {
        static readonly IProductRepository repository = new ProductRepository();


        //Version 3
        //[Authorize]
        [HttpGet]
        [Route("api/v3/products")]
        public IEnumerable<Product> GetAllProductsFromRepository()
        {
            return repository.GetAll();

        }
        //Route constraints let you restrict how the parameters in the route template are matched. 
        //The general syntax is "{parameter:constraint}".
        //Constraints on URL parameters

        //We can even restrict the template placeholder to the type of parameter it can have. 
        //For example, we can restrict that the request will be only served if the id is greater than 2.
        //Otherwise the request will not work. For this, we will apply multiple constraints in the same request:


        //Type of the parameter id must be an integer.
        //id should be greater than 2.
        //http://localhost:9000/api/v3/products/1 404 error code
        [HttpGet]
        [Route("api/v3/products/{id:int:min(2)}", Name = "getProductByIdv3")]

        public Product retrieveProductfromRepository(int id)
        {
            Product item = repository.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }


        [HttpGet]
        [Route("api/v3/products", Name = "getProductByCategoryv3")]
        //http://localhost:9000/api/v3/products?category=
        //http://localhost:9000/api/v3/products?category=Groceries

        public IEnumerable<Product> GetProductsByCategory(string category)
        {
            return repository.GetAll().Where(
                p => string.Equals(p.Category, category, StringComparison.OrdinalIgnoreCase));
        }


        //Response code: By default, the Web API framework sets the response status code to 200 (OK). 
        //But according to the HTTP/1.1 protocol, when a POST request results in the creation of a resource, the server should reply with status 201 (Created).
        //Location: When the server creates a resource, it should include the URI of the new resource in the Location header of the response.

        [HttpPost]
        [Route("api/v3/products")]
        public HttpResponseMessage PostProduct(Product item)
        {
            if (ModelState.IsValid)
            {
                item = repository.Add(item);
                var response = Request.CreateResponse<Product>(HttpStatusCode.Created, item);

                // Generate a link to the new product and set the Location header in the response.

                string uri = Url.Link("getProductByIdv3", new { id = item.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }







        [HttpPut]
        [Route("api/v3/products/{id:int}")]
        public HttpResponseMessage PutProduct(int id, Product product)
        {

            if (ModelState.IsValid)
            {
                product.Id = id;
                Product item = repository.Get(id);
                if (item==null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Product found!");
                }
                else if (!repository.Update(product))
                {


                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Unable to process PUT request");
                }

            }
            return Request.CreateResponse(HttpStatusCode.OK, "Successfully updated a product");

        }

        [HttpDelete]
        [Route("api/v3/products/{id:int}")]
        public HttpResponseMessage DeleteProduct(int id)
        {
            if (ModelState.IsValid)
            {
                Product item = repository.Get(id);
                if (item == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Product found!");
                }
                try
                {
                    repository.Remove(id);
                }
                catch (Exception ex)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Unable to process DELETE request");
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, "Successfully deleted a product");
        }

    }
}