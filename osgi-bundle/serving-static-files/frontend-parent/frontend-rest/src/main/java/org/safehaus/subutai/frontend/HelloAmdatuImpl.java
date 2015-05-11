package org.safehaus.subutai.frontend;


import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by talas on 5/10/15.
 */
public class HelloAmdatuImpl implements HelloAmdatu
{
    private static final Logger LOGGER = LoggerFactory.getLogger( HelloAmdatuImpl.class );


    public HelloAmdatuImpl()
    {
        LOGGER.error( "Class initialized" );
    }


    public Response sayHello( final String name )
    {
        return Response.ok( "Hello " + name ).build();
    }
}
