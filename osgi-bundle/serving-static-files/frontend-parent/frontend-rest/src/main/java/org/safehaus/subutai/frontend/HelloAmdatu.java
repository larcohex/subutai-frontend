package org.safehaus.subutai.frontend;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;


/**
 * Created by talas on 5/10/15.
 */
@Path( "hello" )
public interface HelloAmdatu
{
    @GET
    @Path( "hello/{name}" )
    Response sayHello( @PathParam( "name" ) String name );
}
