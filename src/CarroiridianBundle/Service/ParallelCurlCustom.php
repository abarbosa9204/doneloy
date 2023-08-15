<?php 
namespace CarroiridianBundle\Service;
class ParallelCurlCustom  
{
	private $mh;
	private $requests = [];
	public function __construct() {
		$this->mh = curl_multi_init();
	}
	public function addRequest($url,$callback,$curl_opts=array(),$user_data=array(),$post_fields=null)
	{
		$ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt_array($ch, $curl_opts);
        curl_setopt($ch, CURLOPT_URL, $url);
        if (isset($post_fields)) {
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        }
        
        curl_multi_add_handle($this->mh, $ch);
        
        $ch_array_key = (int)$ch;
        $this->requests[$ch_array_key] = array(
            'url' => $url,
            'callback' => $callback,
            'user_data' => $user_data
        );
	}
	public function startRequests()
	{
		do {
			$mrc = curl_multi_exec($this->mh, $active);
		} while ($mrc == CURLM_CALL_MULTI_PERFORM);
		
		while ($active && $mrc == CURLM_OK) {
			if (curl_multi_select($this->mh) != -1) {
				do {
					$mrc = curl_multi_exec($this->mh, $active);
				} while ($mrc == CURLM_CALL_MULTI_PERFORM);
			}
		}
	}
	public function read()
	{
		while ($info = curl_multi_info_read($this->mh)) {
        
            $ch = $info['handle'];
            $ch_array_key = (int)$ch;
            
            if (!isset($this->requests[$ch_array_key])) {
                die("Error - handle wasn't found in requests: '$ch' in ".
                    print_r($this->outstanding_requests, true));
            }
            
            $request = $this->requests[$ch_array_key];
            $url = $request['url'];
            $content = curl_multi_getcontent($ch);
            $callback = $request['callback'];
            $user_data = $request['user_data'];
            
            call_user_func($callback, $content, $url, $ch, $user_data);
            
            unset($this->requests[$ch_array_key]);
            
			curl_multi_remove_handle($this->mh, $ch);
			curl_close($ch);
        }
	}
	public function close()
	{
		curl_multi_close($this->mh);
	}
}
