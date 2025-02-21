export class tokenInfo
{
    agent_name:string | undefined;
    base_color:string | undefined;
    logo:string | undefined;
    token:string | undefined;
}

export class detailToken
{
    token: string | undefined; 
    refresh_token: string | undefined;
}

export class tokenTrx
{
    rc: number | undefined 
    msg: string  | undefined;
    additional_info: string  | undefined;
    data:detailToken | undefined;
}