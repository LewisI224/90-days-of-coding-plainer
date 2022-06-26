export default function PostSummary ({dest, outgoing, back, price, airline}) {

    return (

        <div>

            <div className='card mb-3'>
                <h5 className="card-header">Destination - {dest}</h5>
                <div className="card-body">
                    <p>Departure - {outgoing}</p>
                    <p>Return - {back}</p>
                    <p>Total Price - {price}</p>
                    <p>Airline - {airline}</p>
                </div>
            </div>
            
        </div>

    )
}